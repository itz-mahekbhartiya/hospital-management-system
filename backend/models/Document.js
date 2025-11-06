const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    documentType: {
        type: String,
        enum: ['PRESCRIPTION', 'LAB_RESULT', 'MEDICAL_REPORT', 'OTHER'],
        default: 'OTHER'
    }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);