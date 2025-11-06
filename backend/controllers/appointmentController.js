const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.createAppointment = async (req, res) => {
    const { doctor, date, reason } = req.body;

    try {
        const patient = req.user.id;

        const doctorUser = await User.findById(doctor);
        if (!doctorUser || doctorUser.role !== 'DOCTOR') {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        const appointment = new Appointment({
            patient,
            doctor,
            date,
            reason
        });

        await appointment.save();

        res.status(201).json(appointment);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Appointment time slot is already booked.' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Get all appointments for the logged-in user
// @route   GET /api/appointments/my
// @access  Private
exports.getMyAppointments = async (req, res) => {
    try {
        let appointments;

        if (req.user.role === 'PATIENT') {
            appointments = await Appointment.find({ patient: req.user.id })
                .populate('doctor', 'name specialty')
                .sort({ date: 'desc' }); 
        } else if (req.user.role === 'DOCTOR') {
            appointments = await Appointment.find({ doctor: req.user.id })
                .populate('patient', 'name email') 
                .sort({ date: 'desc' });
        } else {
            return res.status(400).json({ msg: 'No appointments found for this role.' });
        }
        
        res.status(200).json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Cancel an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        
        if (appointment.patient.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        
        if (appointment.status !== 'PENDING') {
            return res.status(400).json({ msg: 'Cannot cancel a confirmed or completed appointment' });
        }

        await appointment.remove();

        res.status(200).json({ msg: 'Appointment cancelled successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Update appointment status (by Doctor)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
exports.updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    
    const allowedStatus = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        
        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        
        appointment.status = status;
        await appointment.save();

        res.status(200).json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Get ALL appointments (for Admin)
// @route   GET /api/appointments/all
// @access  Private (Admin)
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'name email') 
            .populate('doctor', 'name specialty') 
            .sort({ date: 'desc' }); 
        
        res.status(200).json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};