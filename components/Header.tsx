

import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, GlobeAltIcon, SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';

interface HeaderProps {
    currentTheme: 'light' | 'dark';
    toggleTheme: () => void;
    handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTheme, toggleTheme, handleLogout }) => {
    const { language, setLanguage, t } = useTranslation();

    const handleLanguageChange = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <div className="px-6 pl-28">
                <div className="h-20 flex items-center justify-between">
                    {/* Branding Section */}
                    <div className="flex items-center">
                         <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{t('app_title')}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('app_subtitle')}</p>
                        </div>
                    </div>

                    {/* Right-side Icons */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {currentTheme === 'light' ? (
                                <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            ) : (
                                <SunIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>
                         <button
                            onClick={handleLanguageChange}
                            className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            aria-label="Change language"
                         >
                            <GlobeAltIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                                {language.toUpperCase()}
                            </span>
                        </button>
                        
                        <div className="relative group">
                            <Link to="/settings">
                                <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-400 cursor-pointer" />
                            </Link>
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                                <div className="flex items-center mb-3 p-2">
                                    <UserCircleIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                                    <div className="ml-3">
                                        <p className="font-semibold text-gray-800 dark:text-white">{t('user_name')}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('user_role')}</p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                <Link to="/settings" className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {t('view_profile')}
                                </Link>
                                <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50">
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                    {t('logout')}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
