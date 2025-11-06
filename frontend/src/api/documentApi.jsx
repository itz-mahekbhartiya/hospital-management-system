import api from './api';

/**
 * Gets all documents for the logged-in patient.
 */
export const getMyDocuments = async () => {
    const res = await api.get('/documents/my');
    return res.data; // Returns array of document objects
};


/**
 * Gets all documents for a specific patient (for Doctors).
 * @param {string} patientId - The patient's ID
 */
export const getDocumentsForPatient = async (patientId) => {
    const res = await api.get(`/documents/patient/${patientId}`);
    return res.data; // Returns array of documents
};

/**
 * Uploads a new document for a patient (for Doctors).
 * @param {FormData} formData - The form data containing the file and other info
 */
export const uploadDocument = async (formData) => {
    // For file uploads, we must set the Content-Type header
    const res = await api.post('/documents', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data; // Returns the new document object
};


/**
 * Gets all documents in the system (for Admin).
 */
export const getAllDocuments = async () => {
    const res = await api.get('/documents/all');
    return res.data; // Returns array of all documents
};

/**
 * Deletes a document (for Admin).
 * @param {string} docId - The ID of the document to delete
 */
export const deleteDocument = async (docId) => {
    const res = await api.delete(`/documents/${docId}`);
    return res.data; // Returns { msg: 'Document removed' }
};