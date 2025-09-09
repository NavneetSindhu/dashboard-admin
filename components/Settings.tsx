

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { ClockIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../context/NotificationContext';

const Toggle: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => (
    <div
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-neutral-600'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-slate-500 dark:text-neutral-400">{label}</dt>
        <dd className="mt-1 text-sm text-slate-900 dark:text-neutral-100 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
);

const ActivityItem: React.FC<{ icon: React.ElementType; text: string; time: string }> = ({ icon: Icon, text, time }) => (
    <li className="flex items-start space-x-3">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-700">
            <Icon className="h-5 w-5 text-slate-500 dark:text-neutral-400" />
        </div>
        <div className="flex-1">
            <p className="text-sm text-slate-800 dark:text-neutral-200">{text}</p>
            <p className="text-xs text-slate-400 dark:text-neutral-500">{time}</p>
        </div>
    </li>
);


const Settings: React.FC<{ handleLogout: () => void }> = ({ handleLogout }) => {
    const { t } = useTranslation();
    const { isPushEnabled, setIsPushEnabled } = useNotification();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [apiKeyStatus, setApiKeyStatus] = useState<'Enabled' | 'Disabled'>('Disabled');
    
    useEffect(() => {
        if (process.env.API_KEY && process.env.API_KEY.length > 5) {
            setApiKeyStatus('Enabled');
        } else {
            setApiKeyStatus('Disabled');
        }
    }, []);

    const mockUser = {
        name: t('user_name'),
        role: t('user_role'),
        department: 'National Health Mission, Assam',
        email: 'anjali.rao@nhm-gov.in',
        phone: '+91-9876543210'
    };

    const recentActivities = [
        { icon: ClockIcon, text: t('activity_logged_in'), time: '2 hours ago' },
        { icon: ClockIcon, text: t('activity_viewed_reports'), time: 'Yesterday' },
        { icon: ClockIcon, text: t('activity_generated_summary'), time: '3 days ago' },
    ];

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{t('settings_title_long')}</h1>
                <p className="text-slate-600 dark:text-neutral-400 mt-1">{t('settings_desc')}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Personal Information Card */}
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700">
                        <div className="flex justify-between items-center border-b dark:border-neutral-700 pb-4 mb-4">
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('personal_information')}</h2>
                            <button onClick={handleLogout} className="flex items-center text-sm font-semibold px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">
                                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                {t('logout')}
                            </button>
                        </div>
                        <dl className="divide-y divide-slate-200 dark:divide-neutral-700">
                            <InfoRow label={t('full_name')} value={mockUser.name} />
                            <InfoRow label={t('role')} value={mockUser.role} />
                            <InfoRow label={t('department')} value={mockUser.department} />
                        </dl>
                    </div>

                    {/* Contact Information Card */}
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b dark:border-neutral-700 pb-4 mb-4">{t('contact_information')}</h2>
                        <dl className="divide-y divide-slate-200 dark:divide-neutral-700">
                            <InfoRow label={t('email_address')} value={mockUser.email} />
                            <InfoRow label={t('phone_number')} value={mockUser.phone} />
                        </dl>
                    </div>

                    {/* Notification Settings */}
                     <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b dark:border-neutral-700 pb-4 mb-4">{t('notifications')}</h2>
                        <ul className="divide-y divide-slate-200 dark:divide-neutral-700">
                            <li className="py-4 flex justify-between items-center">
                                 <div>
                                    <h3 className="font-medium text-slate-800 dark:text-neutral-200">{t('email_notifications')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-neutral-400">{t('email_notifications_desc')}</p>
                                </div>
                                <Toggle enabled={emailNotifications} setEnabled={setEmailNotifications} label="Email Notifications" />
                            </li>
                            <li className="py-4 flex justify-between items-center">
                                 <div>
                                    <h3 className="font-medium text-slate-800 dark:text-neutral-200">{t('push_notifications')}</h3>
                                    <p className="text-sm text-slate-500 dark:text-neutral-400">{t('push_notifications_desc')}</p>
                                </div>
                                <Toggle enabled={isPushEnabled} setEnabled={setIsPushEnabled} label="Push Notifications" />
                            </li>
                        </ul>
                     </div>

                    {/* API Settings */}
                     <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b dark:border-neutral-700 pb-4 mb-4">{t('api_integrations')}</h2>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-slate-800 dark:text-neutral-200">{t('ai_features_status')}</h3>
                                <p className="text-sm text-slate-500 dark:text-neutral-400">{t('ai_features_status_desc')}</p>
                            </div>
                            <span className={`px-3 py-1 text-sm font-bold rounded-full ${apiKeyStatus === 'Enabled' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                {apiKeyStatus === 'Enabled' ? t('api_key_status_enabled') : t('api_key_status_disabled')}
                            </span>
                        </div>
                         <div className="mt-4 pt-4 border-t dark:border-neutral-700 text-xs text-slate-500 dark:text-neutral-400">
                             <p>
                                {t('api_key_security_note')}
                             </p>
                         </div>
                     </div>
                </div>
                
                {/* Right Column - Activity */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white border-b dark:border-neutral-700 pb-4 mb-4">{t('recent_activity')}</h2>
                        <ul className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <ActivityItem key={index} icon={activity.icon} text={activity.text} time={activity.time} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;