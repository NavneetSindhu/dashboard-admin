

// FIX: Corrected React import to properly include useState and useEffect hooks.
import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
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

const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') {
        return 'dark';
    }
    return 'light';
};

const ProtectedLayout: React.FC<{ children: React.ReactNode; currentTheme: Theme; toggleTheme: () => void; handleLogout: () => void; }> = ({ children, currentTheme, toggleTheme, handleLogout }) => {
    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
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
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
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
                                            <Route path="/interventions" element={<div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl">Interventions Page - Content to be added.</div>} />
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