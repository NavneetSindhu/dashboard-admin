import React, { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { diseaseDataByLocation } from '../constants';
import { generateChartSummary, refineText } from '../services/geminiService';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import AiSummaryDisplay from './AiSummaryDisplay';
import Modal from './Modal';

type ChartKey = 'incidence' | 'geo' | 'age';
type LocationKey = keyof typeof diseaseDataByLocation;

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    onExpand: () => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, onExpand }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
            <button onClick={onExpand} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400">
                <ArrowsPointingOutIcon className="h-5 w-5"/>
            </button>
        </div>
        <div className="flex-grow w-full h-64">
            {children}
        </div>
    </div>
);

const locationOptions: LocationKey[] = Object.keys(diseaseDataByLocation) as LocationKey[];

const DiseaseTrends: React.FC = () => {
    const { t, language } = useTranslation();
    const [selectedLocation, setSelectedLocation] = useState<LocationKey>('All NE');
    const [elaboratedView, setElaboratedView] = useState<ChartKey | null>(null);
    
    const [aiSummary, setAiSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefining, setIsRefining] = useState(false);

    const chartData = useMemo(() => diseaseDataByLocation[selectedLocation], [selectedLocation]);
    
    const chartTitles: Record<ChartKey, string> = useMemo(() => ({
        incidence: t('chart_title_incidence'),
        geo: t('chart_title_geo'),
        age: t('chart_title_age'),
    }), [t]);

    const handleGenerateSummary = useCallback(async () => {
        setIsLoading(true);
        setAiSummary('');
        const summary = await generateChartSummary(t('disease_trends_title_long'), chartData, language);
        setAiSummary(summary);
        setIsLoading(false);
    }, [chartData, language, t]);

    const handleRefineSummary = useCallback(async (instructionKey: 'refine_shorter' | 'refine_detailed' | 'refine_bullets') => {
        if (!aiSummary) return;
        setIsRefining(true);
        const instruction = t(instructionKey);
        const refinedSummary = await refineText(aiSummary, instruction, language);
        setAiSummary(refinedSummary);
        setIsRefining(false);
    }, [aiSummary, language, t]);
    
    const chartComponents: Record<ChartKey, React.ReactNode> = {
        incidence: <ResponsiveContainer><LineChart data={chartData.incidence}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip wrapperClassName="!border-gray-200 !dark:border-gray-600 !bg-white/80 !dark:bg-gray-800/80 backdrop-blur-sm" contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} /><Line type="monotone" dataKey="value" stroke="#8884d8" /></LineChart></ResponsiveContainer>,
        geo: <ResponsiveContainer><BarChart data={chartData.geo}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip wrapperClassName="!border-gray-200 !dark:border-gray-600 !bg-white/80 !dark:bg-gray-800/80 backdrop-blur-sm" contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }} /><Bar dataKey="value" fill="#82ca9d" /></BarChart></ResponsiveContainer>,
        age: <ResponsiveContainer><BarChart data={chartData.age}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip wrapperClassName="!border-gray-200 !dark:border-gray-600 !bg-white/80 !dark:bg-gray-800/80 backdrop-blur-sm" contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}/><Bar dataKey="value" fill="#ffc658" /></BarChart></ResponsiveContainer>,
    };

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('disease_trends_title_long')}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t('disease_trends_desc')}</p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]"><label htmlFor="disease" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('disease_type')}</label><select id="disease" className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"><option>{t('all_diseases')}</option><option>{t('cholera')}</option><option>{t('typhoid')}</option></select></div>
                    <div className="flex-1 min-w-[200px]"><label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('time_range')}</label><select id="time" className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"><option>{t('last_12_months')}</option><option>{t('last_6_months')}</option><option>{t('last_30_days')}</option></select></div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('location')}</label>
                        <select 
                            id="location" 
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value as LocationKey)}
                            className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title={chartTitles.incidence} onExpand={() => setElaboratedView('incidence')}>
                    {chartComponents.incidence}
                </ChartCard>
                <ChartCard title={chartTitles.geo} onExpand={() => setElaboratedView('geo')}>
                    {chartComponents.geo}
                </ChartCard>
                <ChartCard title={chartTitles.age} onExpand={() => setElaboratedView('age')}>
                    {chartComponents.age}
                </ChartCard>
            </div>
            
            {/* AI Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                     <h2 className="text-xl font-semibold flex items-center dark:text-white">
                        <SparklesIcon className="h-6 w-6 mr-2 text-blue-500"/>
                        {t('ai_summary_title')}
                    </h2>
                    <button 
                        onClick={handleGenerateSummary} 
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                       {isLoading ? t('generating_summary_loading') : t('generate_summary_button')}
                    </button>
                </div>
                
                {isLoading && (
                     <div className="flex flex-col items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                         <p className="mt-4 text-gray-600 dark:text-gray-400">{t('generating_summary_loading')}</p>
                    </div>
                )}

                {aiSummary && !isLoading && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <AiSummaryDisplay summary={aiSummary} />
                         <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{t('refine_result')}:</h4>
                            <div className="flex flex-wrap gap-2">
                                {(['refine_shorter', 'refine_detailed', 'refine_bullets'] as const).map(promptKey => (
                                    <button 
                                        key={promptKey}
                                        onClick={() => handleRefineSummary(promptKey)}
                                        disabled={isRefining}
                                        className="text-xs px-3 py-1.5 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                                    >
                                        {t(promptKey)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {elaboratedView && (
                <Modal
                    isOpen={!!elaboratedView}
                    onClose={() => setElaboratedView(null)}
                    title={`${chartTitles[elaboratedView]} - ${t('elaborated_view')}`}
                    size="lg"
                >
                    <div className="w-full h-[75vh]">
                        {chartComponents[elaboratedView]}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default DiseaseTrends;