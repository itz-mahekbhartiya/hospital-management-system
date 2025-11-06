const express = require('express');
const router = express.Router();
const { getMyDocuments, uploadDocument, getDocumentsForPatient, getAllDocuments, deleteDocument } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import multer middleware

// @route   GET /api/documents/my
// @desc    Get all documents for the logged-in patient
// @access  Private (Patient)
router.get('/my', protect, authorize('PATIENT'), getMyDocuments);

// @route   POST /api/documents
// @desc    Upload a new document
// @access  Private (Doctor)
router.post(
    '/', 
    protect, 
    authorize('DOCTOR'), 
    upload.single('document'), // 'document' is the name of the form field
    uploadDocument
);

// @route   GET /api/documents/patient/:patientId
// @desc    Get all docs for a specific patient
// @access  Private (Doctor)
router.get(
    '/patient/:patientId',
    protect,
    authorize('DOCTOR'),
    getDocumentsForPatient
);


// @route   GET /api/documents/all
// @desc    Get all documents
// @access  Private (Admin only)
router.get('/all', protect, authorize('ADMIN'), getAllDocuments);

// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('ADMIN'), deleteDocument);

module.exports = router;