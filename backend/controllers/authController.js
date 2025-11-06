const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log("register req received")
    try {
        if(!name || !email || !password || !role){
            return res.status(400).json({messsage: "Client data is imcomplete, please provide aname, email, password, and role."})
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = await User.create({
            name,
            email,
            password,
            role: role || 'PATIENT' // Default to PATIENT if no role is provided
        });

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide an email and password' });
        }

        // Find user by email, and explicitly include the password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    // req.user is attached by the 'protect' middleware
    res.status(200).json(req.user);
};