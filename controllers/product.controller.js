const Product = require('../models/product.model');
const User = require('../models/user.model');

exports.getSupplierProducts = async (req, res) => {
  try {
    const supplierId = req.user._id; // Assuming user's ID is stored in req.user
    const products = await Product.find({ supplier_id: supplierId });
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addSubProduct = async (req, res) => {
  try {

    let reqBody = req.body;

    let filePaths = req?.files?.map(x => x.path);
    reqBody.images = filePaths;

    const supplierId = req.user._id; // Assuming user's ID is stored in req.user
    const productId = req.params.productId;

    // Check if the product belongs to the supplier
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: 'Product data not found' });
    }

    if (!['subproduct'].includes(reqBody.product_type)) {
      return res.status(400).send({ message: 'Please enter valid product type' });
    }

    if (reqBody.product_type == 'subproduct' && !reqBody.product_id) {
      return res.status(400).send({ message: 'Please enter product Id' });
    }

    reqBody.created_by = supplierId;

    let productCreated = new Product(reqBody);
    await productCreated.save();

    res.status(201).json({ message: 'Sub-product added successfully' });
  } catch (error) {
    console.error('Error(addSubProduct): ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductStatus = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if the product belongs to the supplier
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: 'Product data not found' });
    }

    res.status(200).json({ message: 'Product status fetched successfully', status: product.status });
  } catch (error) {
    console.error('Error(getProductStatus): ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if the product belongs to the supplier
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(400).json({ message: 'Product data not found' });
    }

    product.status = req.body.status;
    await product.save();

    res.status(200).json({ message: 'Product status updated successfully', status: product.status });
  } catch (error) {
    console.error('Error(updateProductStatus): ', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    // const buyerId = req.user._id; // Assuming user's ID is stored in req.user

    // Implement product creation logic here
    let reqBody = req.body;

    let files = req.files;

    let filePaths = files.map(x => x.path);
    reqBody.images = filePaths;

    if (!['product', 'subproduct'].includes(reqBody.product_type)) {
      return res.status(400).send({ message: 'Please enter valid product type' });
    }

    if (reqBody.product_type == 'subproduct' && !reqBody.product_id) {
      return res.status(400).send({ message: 'Please enter product Id' });
    }

    reqBody.created_by = req.user._id;

    let productCreated = new Product(reqBody);
    await productCreated.save();

    res.status(201).json({ message: 'Product created successfully', data: productCreated });
  } catch (error) {
    console.error('Error(createProduct): ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignProductToSupplier = async (req, res) => {
  try {
    const buyerId = req.user._id; // Assuming user's ID is stored in req.user
    const productId = req.params.productId;
    const { user_id } = req.body;

    // Check if the product belongs to the buyer
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(403).json({ message: 'Product data not found' });
    }

    if (user_id) {
      let isExists = await User.findOne({ _id: user_id, userType: 'supplier' });
      if (!isExists) {
        return res.status(400).json({ message: 'User data not found' });
      }
    }

    product.supplier_id = user_id;
    await product.save();

    res.status(200).json({ message: 'Product assigned to a supplier successfully' });
  } catch (error) {
    console.error('Error(assignProductToSupplier): ', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
