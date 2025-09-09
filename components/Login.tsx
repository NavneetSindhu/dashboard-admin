

import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface LoginProps {
    handleLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
    const { t } = useTranslation();
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (isLoginView) {
            // Demo login validation
            if (email === 'admin@gov.in' && password === 'password123') {
                handleLogin();
            } else {
                setError('Invalid credentials. Please use the demo credentials.');
            }
        } else {
            // Mock signup
            alert('Sign up functionality is for demonstration purposes only.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-neutral-900 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <ShieldCheckIcon className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-500" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mt-4">{t('app_title')}</h1>
                    <p className="text-slate-600 dark:text-neutral-400">{t('app_subtitle')}</p>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-slate-200 dark:border-neutral-700 p-8">
                    <h2 className="text-2xl font-semibold text-center text-slate-900 dark:text-white">{isLoginView ? t('welcome_back') : t('create_account')}</h2>
                    <p className="text-center text-slate-500 dark:text-neutral-400 text-sm mt-2">{isLoginView ? t('login_prompt') : t('signup_prompt')}</p>
                    
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-neutral-300">{t('email')}</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 rounded-lg border-slate-300 bg-slate-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-neutral-300">{t('password')}</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 rounded-lg border-slate-300 bg-slate-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {isLoginView ? t('login') : t('signup')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            {isLoginView ? t('no_account') : t('have_account')} {isLoginView ? t('signup') : t('login')}
                        </button>
                    </div>

                    {isLoginView && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">{t('demo_credentials')}</h3>
                                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                                        <p>{t('demo_email')}</p>
                                        <p>{t('demo_password')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;