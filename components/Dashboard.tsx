import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, BeakerIcon, DocumentChartBarIcon, ShieldExclamationIcon, MapPinIcon, ClockIcon, InformationCircleIcon, MapIcon, ChartPieIcon, UsersIcon } from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { diseaseTrendsChartData, mapLocationData } from '../constants';
import { useTranslation } from '../context/LanguageContext';
import AnimatedNumber from './AnimatedNumber';

const MetricCard: React.FC<{ title: string; value: number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="h-full bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-neutral-700 flex items-center hover:shadow-lg hover:border-blue-500 hover:scale-105 transform transition-all duration-300 cursor-pointer">
        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-3 rounded-full">
            <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 overflow-hidden">
            <p className="text-sm text-slate-500 dark:text-neutral-400">{title}</p>
            <AnimatedNumber value={value} />
        </div>
    </div>
);

const riskColorMap = {
    High: '#ef4444', // red-500
    Medium: '#f97316', // orange-500
    Low: '#22c55e', // green-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-200 dark:border-neutral-700 shadow-lg">
                <p className="label font-bold text-slate-800 dark:text-neutral-200">{`${label}`}</p>
                <p className="intro text-blue-600 dark:text-blue-400">{`Cases: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const alertKeys = ['alert_details_1', 'alert_details_2', 'alert_details_3'] as const;

const Dashboard: React.FC<{currentTheme: 'light' | 'dark'}> = ({ currentTheme }) => {
    const { t } = useTranslation();
    const [currentView, setCurrentView] = useState<'map' | 'graph'>('map');
    const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
    const [metrics, setMetrics] = useState({
        outbreaks: 3,
        cases: 125,
        water: 18,
        reports: 45
    });
    const lastUpdated = new Date().toLocaleString();

    useEffect(() => {
        const alertInterval = setInterval(() => {
            setCurrentAlertIndex(prevIndex => (prevIndex + 1) % alertKeys.length);
        }, 15000); // Cycle every 15 seconds

        const metricsInterval = setInterval(() => {
            setMetrics(prevMetrics => ({
                outbreaks: prevMetrics.outbreaks + (Math.random() < 0.02 ? 1 : 0), // Infrequent increase
                cases: prevMetrics.cases + Math.floor(Math.random() * 4), // 0-3 new cases
                water: prevMetrics.water + (Math.random() < 0.05 ? 1 : 0), // Less frequent
                reports: prevMetrics.reports + Math.floor(Math.random() * 2), // 0-1 new reports
            }));
        }, 2000); // update every 2 seconds

        return () => {
            clearInterval(alertInterval);
            clearInterval(metricsInterval);
        };
    }, []);

    // Define the geographical boundaries for North-East India
    const northEastIndiaBounds: [[number, number], [number, number]] = [
        [21.5, 89.0], // South-West corner
        [29.5, 97.5], // North-East corner
    ];
    
    const lightTileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    const darkTileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    return (
        <div className="space-y-6">
             <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/30 p-5 rounded-xl flex items-start space-x-4">
                <div className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-full flex-shrink-0">
                    <ShieldExclamationIcon className="h-7 w-7"/>
                </div>
                <div>
                    <h2 className="text-xl font-semibold flex items-center text-red-800 dark:text-red-300">
                        {t('urgent_alerts')}
                    </h2>
                    <p className="text-red-700 dark:text-red-300 font-medium mt-1">{t(alertKeys[currentAlertIndex])}</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{t('alert_source')}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-5 w-5 text-slate-500 dark:text-neutral-400 flex-shrink-0" />
                        <select id="location" className="block w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <option>{t('all_ne')}</option>
                            <option>{t('assam')}</option>
                            <option>{t('tripura')}</option>
                            <option>{t('meghalaya')}</option>
                            <option>{t('mizoram')}</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-slate-500 dark:text-neutral-400 flex-shrink-0" />
                        <select id="time" className="block w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <option>{t('last_30_days')}</option>
                            <option>{t('last_6_months')}</option>
                            <option>{t('last_12_months')}</option>
                        </select>
                    </div>
                </div>
                <div className="text-sm text-slate-500 dark:text-neutral-400 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1.5"/>
                    {t('last_updated')}: {lastUpdated}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/disease-trends">
                    <MetricCard title={t('active_outbreaks')} value={metrics.outbreaks} icon={ShieldExclamationIcon} />
                </Link>
                 <Link to="/disease-trends">
                    <MetricCard title={t('cases_today')} value={metrics.cases} icon={DocumentChartBarIcon} />
                </Link>
                 <Link to="/water-quality">
                    <MetricCard title={t('at_risk_water')} value={metrics.water} icon={BeakerIcon} />
                </Link>
                 <Link to="/community-reports">
                    <MetricCard title={t('asha_reports')} value={metrics.reports} icon={UsersIcon} />
                </Link>
            </div>

            {/* Map and Graph View */}
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold dark:text-white">{t('map_title')}</h2>
                    <div className="flex items-center gap-1 bg-slate-200 dark:bg-neutral-700 p-1 rounded-lg">
                        <button
                            onClick={() => setCurrentView('map')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${currentView === 'map' ? 'bg-white dark:bg-neutral-800 shadow' : 'text-slate-600 dark:text-neutral-300'}`}
                        >
                            <MapIcon className="h-5 w-5" />
                            {t('map_view')}
                        </button>
                        <button
                             onClick={() => setCurrentView('graph')}
                             className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${currentView === 'graph' ? 'bg-white dark:bg-neutral-800 shadow' : 'text-slate-600 dark:text-neutral-300'}`}
                        >
                            <ChartPieIcon className="h-5 w-5" />
                            {t('graph_view')}
                        </button>
                    </div>
                </div>

                <div className="h-[450px] w-full rounded-lg overflow-hidden relative">
                    {/* Map View */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${currentView === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <MapContainer
                            key={currentTheme}
                            center={[26.2006, 92.9376]} // Centered on Assam for a good starting view of NE India
                            zoom={7}
                            scrollWheelZoom={false}
                            style={{ height: '100%', width: '100%' }}
                            maxBounds={northEastIndiaBounds}
                            minZoom={6}
                        >
                            <TileLayer
                                url={lightTileUrl}
                            />
                            {mapLocationData.map(loc => (
                                <CircleMarker
                                    key={loc.name}
                                    center={loc.coordinates}
                                    radius={5 + loc.outbreaks * 5 + loc.pendingReports * 2}
                                    pathOptions={{
                                        color: riskColorMap[loc.risk],
                                        fillColor: riskColorMap[loc.risk],
                                        fillOpacity: 0.6
                                    }}
                                >
                                    <Popup>
                                        <div className="font-sans">
                                            <h3 className="font-bold text-base mb-1">{loc.name}</h3>
                                            <p><span className="font-semibold">Risk Level:</span> <span style={{ color: riskColorMap[loc.risk] }}>{loc.risk}</span></p>
                                            <p><span className="font-semibold">Active Outbreaks:</span> {loc.outbreaks}</p>
                                            <p><span className="font-semibold">Pending Reports:</span> {loc.pendingReports}</p>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* Graph View */}
                    <div className={`absolute inset-0 transition-opacity duration-500 p-4 ${currentView === 'graph' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={diseaseTrendsChartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={currentTheme === 'dark' ? '#525252' : '#e5e7eb'} />
                                <XAxis dataKey="name" tick={{ fill: currentTheme === 'dark' ? '#a3a3a3' : '#4b5563' }} />
                                <YAxis tick={{ fill: currentTheme === 'dark' ? '#a3a3a3' : '#4b5563' }}/>
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
