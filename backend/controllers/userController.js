const User = require('../models/User');

// @desc    Get all users with the role 'DOCTOR'
// @route   GET /api/users/doctors
// @access  Private
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'DOCTOR' })
            .select('_id name specialty');
        
        res.status(200).json(doctors);
    } catch (err) {
        console.log("doctors are not here")
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



// @desc    Get all users (for Admin)
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


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

        user = await User.create({
            name,
            email,
            password,
            role,
            specialty
        });

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