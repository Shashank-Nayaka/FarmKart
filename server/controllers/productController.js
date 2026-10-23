const Product = require('../models/Product');

// @desc Fetch all products with search & category filtering
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, keyword, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    let productQuery = Product.find(query);

    if (sort === 'price-low') {
      productQuery = productQuery.sort({ price: 1 });
    } else if (sort === 'price-high') {
      productQuery = productQuery.sort({ price: -1 });
    } else if (sort === 'rating') {
      productQuery = productQuery.sort({ rating: -1 });
    } else {
      productQuery = productQuery.sort({ createdAt: -1 });
    }

    const products = await productQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Fetch single product by ID
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a product (Admin only)
// @route POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      stock,
      unit,
      brand,
      description,
      imageUrl,
      keyFeatures,
      isFeatured,
    } = req.body;

    const product = new Product({
      name,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      stock: Number(stock),
      unit: unit || 'Pack',
      brand: brand || 'AgriGold',
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=400',
      keyFeatures: Array.isArray(keyFeatures) ? keyFeatures : (keyFeatures ? keyFeatures.split(',').map(s => s.trim()) : []),
      isFeatured: isFeatured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Update product & stock (Admin only)
// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalPrice,
      stock,
      unit,
      brand,
      description,
      imageUrl,
      keyFeatures,
      isFeatured,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.category = category !== undefined ? category : product.category;
      product.price = price !== undefined ? Number(price) : product.price;
      product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.unit = unit !== undefined ? unit : product.unit;
      product.brand = brand !== undefined ? brand : product.brand;
      product.description = description !== undefined ? description : product.description;
      product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl;
      if (keyFeatures) {
        product.keyFeatures = Array.isArray(keyFeatures) ? keyFeatures : keyFeatures.split(',').map(s => s.trim());
      }
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete a product (Admin only)
// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
