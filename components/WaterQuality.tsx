import React, { useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { phLevelChartData } from '../constants';
import { generateChartSummary } from '../services/geminiService';
import Modal from './Modal';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { useTranslation } from '../context/LanguageContext';
import AiSummaryDisplay from './AiSummaryDisplay';

const WaterQuality: React.FC = () => {
    const { t, language } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiSummary, setAiSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateSummary = useCallback(async () => {
        setIsModalOpen(true);
        setIsLoading(true);
        setAiSummary('');
        const summary = await generateChartSummary(t('water_quality_title_long'), {
            current: { ph: 7.2, turbidity: '0.5 NTU', bacterial: 'Negative' },
            historicalPh: phLevelChartData
        }, language);
        setAiSummary(summary);
        setIsLoading(false);
    }, [t, language]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('water_quality_title_long')}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t('water_quality_desc')}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]"><label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('location')}</label><select id="location" className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"><option>{t('all_locations')}</option></select></div>
                    <div className="flex-1 min-w-[200px]"><label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('time_range')}</label><select id="time" className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"><option>{t('last_30_days')}</option></select></div>
                </div>
                <div className="pt-6 sm:pt-0"><button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center font-semibold"><span className="text-yellow-300 mr-2">✨</span> {t('generate_insights')}</button></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('current_water_quality')}</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-baseline"><span className="text-gray-600 dark:text-gray-400">{t('ph_level')}</span><span className="font-bold text-2xl text-gray-900 dark:text-white">7.2</span></div>
                        <div className="flex justify-between items-baseline"><span className="text-gray-600 dark:text-gray-400">{t('turbidity')}</span><span className="font-bold text-2xl text-gray-900 dark:text-white">0.5 NTU</span></div>
                        <div className="flex justify-between items-baseline"><span className="text-gray-600 dark:text-gray-400">{t('bacterial_presence')}</span><span className="font-bold text-2xl text-green-600 dark:text-green-400">{t('negative')}</span></div>
                    </div>
                </div>
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start">
                        <div>
                             <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('ph_over_time')}</h3>
                             <p className="text-2xl font-bold text-gray-900 dark:text-white">7.1</p>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{t('last_30_days')}</p>
                        </div>
                        <div className="flex items-center text-sm text-red-600 bg-red-100 px-2 py-1 rounded-full dark:bg-red-900/50 dark:text-red-400"><ArrowUpIcon className="h-4 w-4 mr-1"/><span>+0.1%</span></div>
                    </div>
                    <div style={{ width: '100%', height: 200, marginTop: '1rem' }}>
                        <ResponsiveContainer>
                            <LineChart data={phLevelChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis domain={[6.8, 7.4]} /><Tooltip wrapperClassName="!border-gray-200 !dark:border-gray-600 !bg-white/80 !dark:bg-gray-800/80 backdrop-blur-sm" contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} /><Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} /></LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('ai_summary_title')}</h2>
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{t('click_to_generate_summary')}</p>
                    <button onClick={handleGenerateSummary} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center mx-auto font-semibold"><span className="text-yellow-300 mr-2">✨</span> {t('generate_summary_button')}</button>
                </div>
            </div>

             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('ai_wq_summary_title')}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('generating_summary_loading')}</p>
                    </div>
                ) : (
                    <AiSummaryDisplay summary={aiSummary} />
                )}
            </Modal>
        </div>
    );
};

export default WaterQuality;