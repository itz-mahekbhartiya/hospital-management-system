import React, { useState, useEffect } from 'react';
import { getAllDocuments, deleteDocument } from '../api/documentApi';
import { Download, Trash2, FileText } from 'lucide-react';
import { API_URL } from '../api/api'; 

const DocumentRow = ({ doc, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await deleteDocument(doc._id);
                onDelete(doc._id); 
            } catch (error) {
                alert('Failed to delete document.');
                setIsDeleting(false);
            }
        }
    };

    const downloadUrl = `${API_URL}/${doc.filePath}`;

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.fileName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.patient.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadedBy.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.documentType}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <a 
                    href={downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                    title="Download"
                >
                    <Download className="w-4 h-4" />
                </a>
                <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center text-red-600 hover:text-red-900 disabled:text-gray-400"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
};

const DocumentManagement = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getAllDocuments();
                setDocuments(data);
            } catch (error) {
                setError('Could not fetch documents.');
            }
            setIsLoading(false);
        };
        fetchDocuments();
    }, []);

    const handleDocumentDeleted = (docId) => {
        setDocuments(prevDocs => prevDocs.filter(doc => doc._id !== docId));
    };

    if (isLoading) return <div className="text-center p-4">Loading all documents...</div>;
    if (error) return <div className="p-3 text-red-800 bg-red-100 rounded-md">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Document Management</h2>
            <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {documents.map(doc => (
                            <DocumentRow 
                                key={doc._id} 
                                doc={doc} 
                                onDelete={handleDocumentDeleted} 
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentManagement;