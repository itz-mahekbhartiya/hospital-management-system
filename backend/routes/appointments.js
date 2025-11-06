const express = require('express');
const router = express.Router();
const { 
    createAppointment, 
    getMyAppointments, 
    cancelAppointment ,
    updateAppointmentStatus,
    getAllAppointments
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private (only Patients)
router.post('/', protect, authorize('PATIENT'), createAppointment);

// @route   GET /api/appointments/my
// @desc    Get all appointments for the logged-in user
// @access  Private
router.get('/my', protect, getMyAppointments);

// @route   DELETE /api/appointments/:id
// @desc    Cancel an appointment
// @access  Private
router.delete('/:id', protect, cancelAppointment);

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private (only Doctors)
router.put(
    '/:id/status', 
    protect, 
    authorize('DOCTOR'), 
    updateAppointmentStatus
);

// @route   GET /api/appointments/all
// @desc    Get all appointments in the system
// @access  Private (Admin only)
router.get('/all', protect, authorize('ADMIN'), getAllAppointments);


module.exports = router;