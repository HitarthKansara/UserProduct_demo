const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/userProdDB')
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Err(dbConnection): ', err));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
