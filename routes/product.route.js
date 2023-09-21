const express = require('express');
const router = express.Router();

const { authenticate, supplierAccess, buyerAccess } = require('../middlewares/authentication');
const { upload } = require('../middlewares/fileupload');
const { getSupplierProducts, addSubProduct, getProductStatus, createProduct, assignProductToSupplier, updateProductStatus } = require('../controllers/product.controller');

// Supplier routes
router.get('/supplier/products', authenticate, supplierAccess, getSupplierProducts);
router.post('/supplier/products/:productId/subproducts', authenticate, supplierAccess, upload.array('product_image', 10), addSubProduct);
router.get('/supplier/products/:productId/status', authenticate, supplierAccess, getProductStatus);
router.put('/supplier/products/:productId/status-change', authenticate, supplierAccess, updateProductStatus);

// Buyer routes
router.post('/buyer/products', authenticate, buyerAccess, upload.array('product_image', 10), createProduct);
router.put('/buyer/products/:productId/assign', authenticate, buyerAccess, assignProductToSupplier);

module.exports = router;
