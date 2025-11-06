const User = require('../models/User');

// @desc    Get all users with the role 'DOCTOR'
// @route   GET /api/users/doctors
// @access  Private
exports.getDoctors = async (req, res) => {
    try {
        // Find all users who are doctors
        // We only send back their ID, name, and specialty
        const doctors = await User.find({ role: 'DOCTOR' })
            .select('_id name specialty');
        
        res.status(200).json(doctors);
    } catch (err) {
        console.log("doctors are not here")
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



// --- NEW FUNCTION 1 ---
// @desc    Get all users (for Admin)
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users, but don't send their passwords
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW FUNCTION 2 ---
// @desc    Create a new user (by Admin)
// @route   POST /api/users
// @access  Private (Admin)
exports.createUser = async (req, res) => {
    const { name, email, password, role, specialty } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = await User.create({
            name,
            email,
            password,
            role,
            specialty // This will only apply if the role is DOCTOR
        });

        // We don't send a token, we just send back the created user
        // (without their password)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            specialty: user.specialty,
            createdAt: user.createdAt
        };

        res.status(201).json(userResponse);

    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server error');
    }
};