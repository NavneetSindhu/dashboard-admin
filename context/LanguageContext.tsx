import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import en from '../locales/en';
import hi from '../locales/hi';

type Language = 'en' | 'hi';
type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: keyof Translations) => string;
}

const translations: Record<Language, Translations> = { en, hi };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedLang = window.localStorage.getItem('language');
        if (storedLang === 'en' || storedLang === 'hi') {
            return storedLang;
        }
    }
    return 'en'; // Default language
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(getInitialLanguage);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key: keyof Translations): string => {
        return translations[language][key] || translations['en'][key];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
