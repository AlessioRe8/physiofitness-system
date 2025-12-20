import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;