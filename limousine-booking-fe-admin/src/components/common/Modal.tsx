import React from 'react';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl'
    };

    return (
        <>
            {/* Backdrop with higher z-index to cover sidebar */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
                <div
                    className={`${sizeClasses[size]} w-full bg-white rounded-xl shadow-xl transform transition-all duration-300 ease-in-out animate-modal-show`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
                        >
                            <IoMdClose size={20} />
                        </button>
                    </div>

                    {/* Body with better padding and scroll */}
                    <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal; 