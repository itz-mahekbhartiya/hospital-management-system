const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // This will be the Doctor
        required: true
    },
    // The original name of the file on the user's computer
    fileName: {
        type: String,
        required: true
    },
    // The path to the file on the server (e.g., 'uploads/document-12345.pdf')
    filePath: {
        type: String,
        required: true
    },
    // e.g., 'application/pdf', 'image/jpeg'
    fileType: {
        type: String,
        required: true
    },
    // e.g., 'Prescription', 'Lab Result', 'Medical Report'
    documentType: {
        type: String,
        enum: ['PRESCRIPTION', 'LAB_RESULT', 'MEDICAL_REPORT', 'OTHER'],
        default: 'OTHER'
    }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);