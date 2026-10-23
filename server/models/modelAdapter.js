const { getCollection } = require('../config/store');

function createModelAdapter(mongooseModel, collectionName) {
  function ModelProxy(data) {
    if (global.isMongoConnected) {
      return new mongooseModel(data);
    }
    const coll = getCollection(collectionName);
    const doc = {
      _id: coll.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return coll.wrapDocument(doc);
  }

  ModelProxy.countDocuments = function(...args) {
    if (global.isMongoConnected) return mongooseModel.countDocuments(...args);
    return getCollection(collectionName).countDocuments(...args);
  };

  ModelProxy.findOne = function(...args) {
    if (global.isMongoConnected) return mongooseModel.findOne(...args);
    return getCollection(collectionName).findOne(...args);
  };

  ModelProxy.findById = function(...args) {
    if (global.isMongoConnected) return mongooseModel.findById(...args);
    return getCollection(collectionName).findById(...args);
  };

  ModelProxy.find = function(...args) {
    if (global.isMongoConnected) return mongooseModel.find(...args);
    return getCollection(collectionName).find(...args);
  };

  ModelProxy.create = function(...args) {
    if (global.isMongoConnected) return mongooseModel.create(...args);
    return getCollection(collectionName).create(...args);
  };

  ModelProxy.insertMany = function(...args) {
    if (global.isMongoConnected) return mongooseModel.insertMany(...args);
    return getCollection(collectionName).insertMany(...args);
  };

  ModelProxy.findByIdAndUpdate = function(...args) {
    if (global.isMongoConnected) return mongooseModel.findByIdAndUpdate(...args);
    return getCollection(collectionName).findByIdAndUpdate(...args);
  };

  ModelProxy.deleteOne = function(...args) {
    if (global.isMongoConnected) return mongooseModel.deleteOne(...args);
    return getCollection(collectionName).deleteOne(...args);
  };

  return ModelProxy;
}

module.exports = createModelAdapter;
