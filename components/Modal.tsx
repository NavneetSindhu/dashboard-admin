import React from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const sizeClasses = {
        md: 'max-w-3xl',
        lg: 'max-w-5xl',
        xl: 'max-w-7xl',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[2100] flex justify-center items-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={onClose}>
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full ${sizeClasses[size]} transform transition-all`} role="document" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 id="modal-title" className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                        <SparklesIcon className="h-6 w-6 mr-2 text-blue-500" />
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
                <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-150 font-semibold"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;