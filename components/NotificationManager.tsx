
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Notification from './Notification';
import { useNotification } from '../context/NotificationContext';
import { useTranslation } from '../context/LanguageContext';

interface NotificationState {
    id: number;
    title: string;
    message: string;
    link: string;
}

const NotificationManager: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationState[]>([]);
    const { isPushEnabled } = useNotification();
    const { t } = useTranslation();

    const demoNotifications = useMemo(() => [
        { title: t('demo_notification_title_1'), message: t('demo_notification_message_1'), link: '/community-reports' },
        { title: t('demo_notification_title_2'), message: t('demo_notification_message_2'), link: '/water-quality' },
        { title: t('demo_notification_title_3'), message: t('demo_notification_message_3'), link: '/disease-trends' },
        { title: t('demo_notification_title_4'), message: t('demo_notification_message_4'), link: '/dashboard' },
    ], [t]);

    const addNotification = useCallback(() => {
        const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
        const newNotification = {
            id: new Date().getTime(),
            ...randomNotification,
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep max 5 notifications
    }, [demoNotifications]);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    useEffect(() => {
        let intervalId: number | undefined;

        if (isPushEnabled) {
            // Trigger a notification immediately when enabled, then set interval
            addNotification(); 
            intervalId = window.setInterval(addNotification, 15000); // 15 seconds
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isPushEnabled, addNotification]);

    return (
        <div
            aria-live="assertive"
            className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-[9999]"
        >
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        id={notification.id}
                        title={notification.title}
                        message={notification.message}
                        link={notification.link}
                        onClose={removeNotification}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotificationManager;
