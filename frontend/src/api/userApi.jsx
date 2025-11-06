import api from './api';


export const getDoctors = async () => {
    const res = await api.get('/users/doctors');
    return res.data; 
};



export const getAllUsers = async () => {
    const res = await api.get('/users');
    return res.data; 
};


export const createUser = async (userData) => {
    const res = await api.post('/users', userData);
    return res.data; 
};