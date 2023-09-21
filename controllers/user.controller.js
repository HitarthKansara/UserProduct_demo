const bcrypt = require('bcrypt');
const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
const { listeners } = require('../models/product.model');


exports.register = async (req, res) => {
    try {
        const { email, password, name, userType } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Ensure strong password (customize the criteria as needed)
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!password.match(passwordRegex)) {
            return res.status(400).json({ message: 'Password is not strong enough' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            userType
        });

        newUser.auth_token = jwt.sign({ email, name, userType, _id: newUser._id }, 'I love India', { expiresIn: '1d' });
        newUser.refresh_token = jwt.sign({ email, name, userType, _id: newUser._id }, 'I love India', { expiresIn: '7d' });
        // Save the user to the database
        await newUser.save();

        return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error(register): ', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token for authentication
        user.auth_token = jwt.sign({ email, name: user.name, userType: user.userType, _id: user._id }, 'I love India', { expiresIn: '1d' });
        user.refresh_token = jwt.sign({ email, name: user.name, userType: user.userType, _id: user._id }, 'I love India', { expiresIn: '7d' });

        user = await user.save();

        // Return the token or any other relevant user data
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getProfile = (req, res) => {
    // Return the user's profile data
    res.status(200).json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        let { user } = req;

        // Check if the new email is already in use by another user
        if (email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        let userData = await User.findOne({ _id: user._id });

        // Update the user's name and email
        userData.name = name;
        userData.email = email;

        // Save the updated user
        userData = await userData.save();

        res.status(200).json({ message: 'Profile updated successfully', user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
