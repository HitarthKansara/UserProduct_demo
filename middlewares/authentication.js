const User = require('../models/user.model');
const jwt = require('jsonwebtoken');


// authenticate user
exports.authenticate = async (req, res, next) => {
    try {

        if (!req.header('Authorization')) return res.status(400).send({ message: 'Authorization is required' });

        const token = req.header('Authorization')?.toString().replace('Bearer ', '');
        if (!token) return res.status(400).send({ message: 'Unauthorized, please login' });

        const decoded = jwt.verify(token, 'I love India');
        const user = await User.findOne({ _id: decoded._id, auth_token: token }).lean();

        if (!user) return res.status(400).send({ message: 'Unauthorized, please login' });

        req.token = token;
        req.user = user;

        next();
    } catch (err) {
        console.log('Error(authenticate): ', err);

        if (err.message == constants.JWT_EXPIRED_MESSAGE || err.message == constants.JWT_MALFORMED_MESSAGE) {
            return res.status(400).send({ message: 'Unauthorized, please login' });
        }

        return res.status(500).send({ message: 'Server error' });
    }
}

exports.supplierAccess = (req, res, next) => {
    if (req.user.userType != 'supplier') {
        return res.status(403).send({ message: 'Forbidden access' })
    } else {
        next();
    }
}

exports.buyerAccess = (req, res, next) => {
    if (req.user.userType != 'buyer') {
        return res.status(403).send({ message: 'Forbidden access' })
    } else {
        next();
    }
}