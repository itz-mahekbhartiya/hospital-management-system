import React, { useState, useEffect } from 'react';
import { getMyDocuments } from '../api/documentApi';
import { FileText, Download, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { API_URL } from '../api/api'; // We'll need to update api.js to export this

// This is the Accordion Row you described
const HistoryRow = ({ doc }) => {
    const [isOpen, setIsOpen] = useState(false);

    // We need to get the file from our backend server, not the frontend one
    // We will update api.js to export the base URL
    const fileUrl = `http://localhost:5001/${doc.filePath}`;

    return (
        <tbody className="border-b border-gray-200">
            <tr 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {doc.documentType.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Dr. {doc.uploadedBy.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </td>
            </tr>
            {isOpen && (
                <tr className="bg-gray-50">
                    <td colSpan="4" className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                            <div>
                                <h4 className="text-md font-semibold text-gray-800">Document Details</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">File Name:</span> {doc.fileName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Specialty:</span> {doc.uploadedBy.specialty}
                                </p>
                            </div>
                            <a
                                href={fileUrl}
                                download
                                target="_blank" // Open in new tab (safe for PDFs)
                                rel="noopener noreferrer"
                                className="flex items-center justify-center mt-4 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </a>
                        </div>
                    </td>
                </tr>
            )}
        </tbody>
    );
};

const MedicalHistory = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getMyDocuments();
                setDocuments(data);
            } catch (error) {
                setError('Could not fetch medical history.');
            }
            setIsLoading(false);
        };
        fetchDocuments();
    }, []);

    if (isLoading) return <div className="text-center p-4">Loading medical history...</div>;
    if (error) return <div className="p-3 text-red-800 bg-red-100 rounded-md">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Medical History</h2>
            {documents.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">You have no documents in your medical history.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Document Type
                                T</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date Added
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Uploaded By
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    View
                                </th>
                            </tr>
                        </thead>
                        {documents.map(doc => (
                            <HistoryRow key={doc._id} doc={doc} />
                        ))}
                    </table>
                </div>
            )}
        </div>
    );
};

export default MedicalHistory;