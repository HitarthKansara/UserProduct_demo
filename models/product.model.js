const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: { type: String },
    images: [{ type: String }], // Store image path
    supplier_id: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    product_type: { type: String, enum: ['product', 'subproduct'], required: true, default: 'product' },
    product_id: { type: mongoose.Types.ObjectId, ref: 'Product' },
    created_by: { type: mongoose.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'cancelled', 'done'] }
});

module.exports = mongoose.model('Product', productSchema);
