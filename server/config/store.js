const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this.items = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(`Error loading collection ${this.name}:`, e.message);
    }
    return [];
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.items, null, 2), 'utf8');
    } catch (e) {
      console.error(`Error saving collection ${this.name}:`, e.message);
    }
  }

  async countDocuments() {
    return this.items.length;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  wrapDocument(doc) {
    if (!doc) return null;
    const self = this;
    const wrapped = { ...doc };

    // Add matchPassword for user
    if (this.name === 'users') {
      wrapped.matchPassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, wrapped.password);
      };
    }

    // Add save method
    wrapped.save = async function() {
      const idx = self.items.findIndex(i => i._id.toString() === wrapped._id.toString());
      if (idx !== -1) {
        self.items[idx] = { ...wrapped, updatedAt: new Date().toISOString() };
      } else {
        self.items.push(wrapped);
      }
      self.save();
      return self.wrapDocument(wrapped);
    };

    return wrapped;
  }

  findOne(query) {
    const found = this.items.find(item => this.matchQuery(item, query));
    const doc = this.wrapDocument(found);
    return {
      _doc: doc,
      populate() { return this; },
      select() { return this; },
      then(resolve, reject) {
        return Promise.resolve(this._doc).then(resolve, reject);
      }
    };
  }

  findById(id) {
    if (!id) {
      return {
        populate() { return this; },
        select() { return this; },
        then(resolve) { return Promise.resolve(null).then(resolve); }
      };
    }
    const strId = id.toString();
    const found = this.items.find(item => item._id && item._id.toString() === strId);
    const doc = this.wrapDocument(found);
    return {
      _doc: doc,
      populate() { return this; },
      select() { return this; },
      then(resolve, reject) {
        return Promise.resolve(this._doc).then(resolve, reject);
      }
    };
  }


  async create(data) {
    const item = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If user, hash password if plain
    if (this.name === 'users' && item.password && !item.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      item.password = await bcrypt.hash(item.password, salt);
    }

    this.items.push(item);
    this.save();
    return this.wrapDocument(item);
  }

  async insertMany(docs) {
    const created = [];
    for (const d of docs) {
      const item = {
        _id: this.generateId(),
        ...d,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (this.name === 'users' && item.password && !item.password.startsWith('$2')) {
        const salt = await bcrypt.genSalt(10);
        item.password = await bcrypt.hash(item.password, salt);
      }
      this.items.push(item);
      created.push(this.wrapDocument(item));
    }
    this.save();
    return created;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    if (!id) return null;
    const strId = id.toString();
    const idx = this.items.findIndex(item => item._id.toString() === strId);
    if (idx === -1) return null;

    let item = this.items[idx];
    if (update.$inc) {
      for (const [key, val] of Object.entries(update.$inc)) {
        item[key] = (item[key] || 0) + val;
      }
    }
    for (const [key, val] of Object.entries(update)) {
      if (key !== '$inc') {
        item[key] = val;
      }
    }
    item.updatedAt = new Date().toISOString();
    this.items[idx] = item;
    this.save();
    return this.wrapDocument(item);
  }

  async deleteOne(query) {
    const initialLen = this.items.length;
    this.items = this.items.filter(item => !this.matchQuery(item, query));
    this.save();
    return { deletedCount: initialLen - this.items.length };
  }

  find(query = {}) {
    let results = this.items.filter(item => this.matchQuery(item, query));
    const self = this;

    const queryObj = {
      _results: results,
      sort(sortRules) {
        if (sortRules) {
          const key = Object.keys(sortRules)[0];
          const dir = sortRules[key];
          this._results.sort((a, b) => {
            if (a[key] < b[key]) return dir === 1 ? -1 : 1;
            if (a[key] > b[key]) return dir === 1 ? 1 : -1;
            return 0;
          });
        }
        return this;
      },
      populate() {
        return this; // In-memory populated representations
      },
      select() {
        return this;
      },
      then(resolve, reject) {
        return Promise.resolve(this._results.map(r => self.wrapDocument(r))).then(resolve, reject);
      }
    };

    return queryObj;
  }

  matchQuery(item, query) {
    if (!query || Object.keys(query).length === 0) return true;

    for (const [key, val] of Object.entries(query)) {
      if (key === '_id' && item._id) {
        if (item._id.toString() !== val.toString()) return false;
      } else if (key === '$or' && Array.isArray(val)) {
        const matchAny = val.some(subQuery => this.matchQuery(item, subQuery));
        if (!matchAny) return false;
      } else if (val && typeof val === 'object' && val.$regex) {
        const regex = new RegExp(val.$regex, val.$options || '');
        if (!regex.test(item[key] || '')) return false;
      } else if (item[key] !== val) {
        return false;
      }
    }
    return true;
  }
}

const collections = {
  users: new Collection('users'),
  products: new Collection('products'),
  tractors: new Collection('tractors'),
  bookings: new Collection('bookings'),
  orders: new Collection('orders'),
};

module.exports = {
  getCollection: (name) => collections[name],
};
