const Document = require('../models/Document');
const fs = require('fs'); 
const path = require('path'); 

// @desc    Get all documents for the logged-in patient
// @route   GET /api/documents/my
// @access  Private (Patient)
exports.getMyDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ patient: req.user.id })
            .populate('uploadedBy', 'name specialty') // Get the doctor's name
            .sort({ createdAt: 'desc' });
        
        res.status(200).json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Upload a document for a patient
// @route   POST /api/documents
// @access  Private (Doctor)
exports.uploadDocument = async (req, res) => {
    const { patient, documentType } = req.body;
    
    // Check if file exists
    if (!req.file) {
        return res.status(400).json({ msg: 'Please upload a file' });
    }

    // Get file info from multer
    // --- THIS IS THE FIX ---
    // We were missing 'mimetype'
    const { originalname, path, mimetype } = req.file;

    try {
        const newDocument = new Document({
            patient,
            uploadedBy: req.user.id, // The logged-in doctor
            documentType,
            fileName: originalname,
            filePath: path.replace(/\\/g, '/'), // Clean up path for Windows
            fileType: mimetype // <-- ADDED THIS LINE
        });

        await newDocument.save();
        
        // Populate the uploader info to send back
        const doc = await newDocument.populate('uploadedBy', 'name specialty');
        
        res.status(201).json(doc);

    } catch (err) {
        console.error(err.message);
        // This will now show the validation error if it fails
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Get all documents for a specific patient (by Doctor)
// @route   GET /api/documents/patient/:patientId
// @access  Private (Doctor)
exports.getDocumentsForPatient = async (req, res) => {
    try {
        const documents = await Document.find({ patient: req.params.patientId })
            .populate('uploadedBy', 'name specialty')
            .sort({ createdAt: 'desc' });
        
        res.status(200).json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



// @desc    Get ALL documents (for Admin)
// @route   GET /api/documents/all
// @access  Private (Admin)
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find()
            .populate('patient', 'name email')
            .populate('uploadedBy', 'name specialty')
            .sort({ createdAt: 'desc' });
        
        res.status(200).json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a document (by Admin)
// @route   DELETE /api/documents/:id
// @access  Private (Admin)
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        // --- Delete the physical file from /uploads ---
        // We construct the full path to the file
        const filePath = path.join(__dirname, '..', document.filePath);
        
        fs.unlink(filePath, (err) => {
            if (err) {
                // We'll log the error, but not stop the process
                // The file might already be deleted or missing
                console.error(`Failed to delete file: ${filePath}`, err);
            }
        });
        
        // --- Delete the document from MongoDB ---
        await document.deleteOne(); // Replaced deprecated .remove()

        res.status(200).json({ msg: 'Document removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Document not found' });
        }
        res.status(500).send('Server Error');
    }
};