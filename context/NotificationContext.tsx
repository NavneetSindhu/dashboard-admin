import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface NotificationContextType {
    isPushEnabled: boolean;
    setIsPushEnabled: (enabled: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const getInitialPushState = (): boolean => {
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('isPushEnabled') === 'true';
    }
    return false; // Default to disabled
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPushEnabled, setIsPushEnabled] = useState<boolean>(getInitialPushState);

    useEffect(() => {
        localStorage.setItem('isPushEnabled', String(isPushEnabled));
    }, [isPushEnabled]);

    return (
        <NotificationContext.Provider value={{ isPushEnabled, setIsPushEnabled }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
