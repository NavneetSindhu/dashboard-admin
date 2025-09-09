

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../context/LanguageContext';

interface NotificationProps {
    id: number;
    title: string;
    message: string;
    link: string;
    onClose: (id: number) => void;
}

const Notification: React.FC<NotificationProps> = ({ id, title, message, link, onClose }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        const inTimer = setTimeout(() => setIsVisible(true), 100);

        // Set a timer to animate out and then close
        const outTimer = setTimeout(() => {
            handleClose();
        }, 10000); // Auto-close after 10 seconds

        return () => {
            clearTimeout(inTimer);
            clearTimeout(outTimer);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Wait for fade-out animation to complete before calling onClose
        setTimeout(() => onClose(id), 300);
    };

    return (
        <Link to={link} className="w-full max-w-sm block">
            <div
                className={`w-full bg-white dark:bg-neutral-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
            >
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <BellAlertIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{title}</p>
                            <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">{message}</p>
                        </div>
                    </div>
                </div>
                 <div className="border-t border-slate-200 dark:border-neutral-700">
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Prevent link navigation
                            e.stopPropagation(); // Stop event bubbling up to the Link
                            handleClose();
                        }}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-700/50 text-center text-sm font-semibold text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                        {t('dismiss')}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default Notification;