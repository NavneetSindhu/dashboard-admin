import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DiseaseTrends from './components/DiseaseTrends';
import WaterQuality from './components/WaterQuality';
import CommunityReports from './components/CommunityReports';
import Resources from './components/Resources';
import Settings from './components/Settings';
import Login from './components/Login';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationManager from './components/NotificationManager';

type Theme = 'light' | 'dark';

const ProtectedLayout: React.FC<{ children: React.ReactNode; currentTheme: Theme; toggleTheme: () => void; handleLogout: () => void; }> = ({ children, currentTheme, toggleTheme, handleLogout }) => {
    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-800 dark:bg-neutral-900 dark:text-neutral-200">
            <Sidebar />
            <div className="flex-1 flex flex-col w-full">
                <Header currentTheme={currentTheme} toggleTheme={toggleTheme} handleLogout={handleLogout} />
                <main className="flex-1 overflow-y-auto p-6 pt-28 pl-28">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <NotificationManager />
        </div>
    );
};

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        // This is the correct way to get the initial theme.
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    // EFFECT 1: This effect applies the theme class to the <html> element.
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
    
    // EFFECT 2: This effect listens for system theme changes and applies the theme only if a manual choice hasn't been made.
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e: MediaQueryListEvent) => {
            // Only update the theme if the user hasn't made a manual choice.
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount.


    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            // Always persist the user's choice to localStorage.
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    const handleLogin = () => {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    return (
        <LanguageProvider>
            <NotificationProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/login" element={!isAuthenticated ? <Login handleLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
                        <Route 
                            path="/*"
                            element={
                                isAuthenticated ? (
                                    <ProtectedLayout currentTheme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout}>
                                        <Routes>
                                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                            <Route path="/dashboard" element={<Dashboard currentTheme={theme} />} />
                                            <Route path="/disease-trends" element={<DiseaseTrends />} />
                                            <Route path="/water-quality" element={<WaterQuality />} />
                                            <Route path="/community-reports" element={<CommunityReports currentTheme={theme} />} />
                                            <Route path="/interventions" element={<div className="text-center p-12 bg-white dark:bg-neutral-800 rounded-xl">Interventions Page - Content to be added.</div>} />
                                            <Route path="/resources" element={<Resources />} />
                                            <Route path="/settings" element={<Settings handleLogout={handleLogout} />} />
                                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                        </Routes>
                                    </ProtectedLayout>
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                    </Routes>
                </HashRouter>
            </NotificationProvider>
        </LanguageProvider>
    );
};

export default App;