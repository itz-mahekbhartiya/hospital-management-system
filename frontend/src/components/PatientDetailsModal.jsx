import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getDocumentsForPatient, uploadDocument } from '../api/documentApi';
import { X, Upload, FileText, Download, Trash2, Send } from 'lucide-react';

// A single document row
const DocumentRow = ({ doc }) => {
    // Build the full URL to the file on the backend
    const fileUrl = `http://localhost:5001/${doc.filePath}`;

    return (
        <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span className="ml-3 text-sm font-medium text-gray-700">{doc.fileName}</span>
                <span className="ml-2 text-xs text-gray-500">({doc.documentType.replace('_', ' ')})</span>
            </div>
            <a
                href={fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
            >
                <Download className="w-5 h-5" />
            </a>
        </li>
    );
};

const PatientDetailsModal = ({ appointment, onClose }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [documents, setDocuments] = useState([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [docError, setDocError] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    const patient = appointment.patient;

    // Fetch this patient's documents when the modal opens
    const fetchPatientDocs = async () => {
        setIsLoadingDocs(true);
        setDocError(null);
        try {
            const data = await getDocumentsForPatient(patient._id);
            setDocuments(data);
        } catch (error) {
            setDocError("Could not fetch patient's documents.");
        }
        setIsLoadingDocs(false);
    };

    useEffect(() => {
        if (patient?._id) {
            fetchPatientDocs();
        }
    }, [patient?._id]);

    // Handle the new document upload
    const onUploadSubmit = async (data) => {
        if (!data.document[0]) {
            setUploadError('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        // We must use FormData for file uploads
        const formData = new FormData();
        formData.append('patient', patient._id);
        formData.append('documentType', data.documentType);
        formData.append('document', data.document[0]); // The file

        try {
            const newDoc = await uploadDocument(formData);
            // Add the new document to the top of our list
            setDocuments(prevDocs => [newDoc, ...prevDocs]);
            reset(); // Clear the form
        } catch (error) {
            setUploadError(error.response?.data?.msg || 'File upload failed.');
        }
        setIsUploading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Patient Details: {patient.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* Section 1: Upload New Document */}
                    <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="text-lg font-medium text-gray-800">Upload New Document</h4>
                        <form onSubmit={handleSubmit(onUploadSubmit)} className="mt-4 space-y-4">
                            {uploadError && <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">{uploadError}</div>}
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                                        Document Type
                                    </label>
                                    <select
                                        id="documentType"
                                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                                        {...register('documentType', { required: 'Type is required' })}
                                    >
                                        <option value="PRESCRIPTION">Prescription</option>
                                        <option value="MEDICAL_REPORT">Medical Report</option>
                                        <option value="LAB_RESULT">Lab Result</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                    {errors.documentType && <p className="mt-1 text-sm text-red-600">{errors.documentType.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="document" className="block text-sm font-medium text-gray-700">
                                        File
                                    </label>
                                    <input
                                        type="file"
                                        id="document"
                                        className="w-full text-sm text-gray-500 mt-1
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-md file:border-0
                                          file:text-sm file:font-semibold
                                          file:bg-indigo-50 file:text-indigo-700
                                          hover:file:bg-indigo-100"
                                        {...register('document', { required: 'File is required' })}
                                    />
                                    {errors.document && <p className="mt-1 text-sm text-red-600">{errors.document.message}</p>}
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400"
                            >
                                <Upload className="w-5 h-5 mr-2" />
                                {isUploading ? 'Uploading...' : 'Upload Document'}
                            </button>
                        </form>
                    </div>

                    {/* Section 2: Patient's Document History */}
                    <div className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="text-lg font-medium text-gray-800">Document History</h4>
                        {docError && <div className="p-3 mt-4 text-sm text-red-800 bg-red-100 rounded-md">{docError}</div>}
                        {isLoadingDocs ? (
                            <p className="mt-4 text-gray-600">Loading documents...</p>
                        ) : documents.length === 0 ? (
                            <p className="mt-4 text-gray-600">No documents found for this patient.</p>
                        ) : (
                            <ul className="mt-4 space-y-3">
                                {documents.map(doc => (
                                    <DocumentRow key={doc._id} doc={doc} />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsModal;