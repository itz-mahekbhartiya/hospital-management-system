const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please provide an appointment date and time']
    },
    reason: {
        type: String,
        required: [true, 'Please provide a reason for the appointment'],
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    }
}, { timestamps: true });


AppointmentSchema.index({ patient: 1, date: 1 }, { unique: true });


AppointmentSchema.index({ doctor: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);