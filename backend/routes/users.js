const express = require('express');
const router = express.Router();
const { getDoctors,  getAllUsers, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/users/doctors
// @desc    Get a list of all doctors
// @access  Private (must be logged in)
router.get('/doctors', protect, getDoctors);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', protect, authorize('ADMIN'), getAllUsers);

// @route   POST /api/users
// @desc    Create a new user
// @access  Private (Admin only)
router.post('/', protect, authorize('ADMIN'), createUser);

module.exports = router;