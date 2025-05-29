import React from 'react';

interface ErrorModalProps {
    status: number;
    errorMessage: string;
    timestamp: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ status, errorMessage, timestamp, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Error</h2>
                <p className="mb-2"><strong>Status:</strong> {status}</p>
                <p className="mb-2"><strong>Message:</strong> {errorMessage}</p>
                <p className="mb-4"><strong>Timestamp:</strong> {timestamp}</p>
                <button 
                    onClick={onClose} 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;