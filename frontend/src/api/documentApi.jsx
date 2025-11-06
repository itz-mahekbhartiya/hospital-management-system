import api from './api';


export const getMyDocuments = async () => {
    const res = await api.get('/documents/my');
    return res.data; 
};


export const getDocumentsForPatient = async (patientId) => {
    const res = await api.get(`/documents/patient/${patientId}`);
    return res.data; 
};


export const uploadDocument = async (formData) => {
    const res = await api.post('/documents', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};


export const getAllDocuments = async () => {
    const res = await api.get('/documents/all');
    return res.data; 
};

export const deleteDocument = async (docId) => {
    const res = await api.delete(`/documents/${docId}`);
    return res.data;
};