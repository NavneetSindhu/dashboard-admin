import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, BeakerIcon, DocumentChartBarIcon, ShieldExclamationIcon, MapPinIcon, ClockIcon, InformationCircleIcon, MapIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { diseaseTrendsChartData, mapLocationData } from '../constants';
import { useTranslation } from '../context/LanguageContext';

const MetricCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="h-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center hover:shadow-lg hover:border-blue-500 hover:scale-105 transform transition-all duration-300 cursor-pointer">
        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-3 rounded-full">
            <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
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
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                <p className="label font-bold text-gray-800 dark:text-gray-200">{`${label}`}</p>
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
    const lastUpdated = new Date().toLocaleString();

    useEffect(() => {
        const alertInterval = setInterval(() => {
            setCurrentAlertIndex(prevIndex => (prevIndex + 1) % alertKeys.length);
        }, 15000); // Cycle every 15 seconds

        return () => clearInterval(alertInterval);
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

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <select id="location" className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <option>{t('all_ne')}</option>
                            <option>{t('assam')}</option>
                            <option>{t('tripura')}</option>
                            <option>{t('meghalaya')}</option>
                            <option>{t('mizoram')}</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <select id="time" className="block w-full rounded-lg border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            <option>{t('last_30_days')}</option>
                            <option>{t('last_6_months')}</option>
                            <option>{t('last_12_months')}</option>
                        </select>
                    </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1.5"/>
                    {t('last_updated')}: {lastUpdated}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/disease-trends">
                    <MetricCard title={t('active_outbreaks')} value="3" icon={ShieldExclamationIcon} />
                </Link>
                <Link to="/community-reports">
                    <MetricCard title={t('cases_today')} value="125" icon={DocumentChartBarIcon} />
                </Link>
                <Link to="/water-quality">
                    <MetricCard title={t('at_risk_water')} value="18" icon={BeakerIcon} />
                </Link>
                <Link to="/community-reports">
                    <MetricCard title={t('asha_reports')} value="45" icon={DocumentChartBarIcon} />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {currentView === 'map' ? t('map_title') : t('regional_trends')}
                        </h2>
                        <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                            <button
                                onClick={() => setCurrentView('map')}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md flex items-center transition-colors ${currentView === 'map' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <MapIcon className="h-5 w-5 mr-2" />
                                {t('map_view')}
                            </button>
                            <button
                                onClick={() => setCurrentView('graph')}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md flex items-center transition-colors ${currentView === 'graph' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <ChartPieIcon className="h-5 w-5 mr-2" />
                                {t('graph_view')}
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow h-[450px]">
                        {currentView === 'map' ? (
                            <div className="h-full w-full rounded-lg overflow-hidden">
                                <MapContainer 
                                    key={currentTheme} // Force re-render on theme change
                                    center={[26.0, 93.5]} 
                                    zoom={7} 
                                    scrollWheelZoom={false} 
                                    style={{ height: '100%', width: '100%' }}
                                    maxBounds={northEastIndiaBounds}
                                    minZoom={6}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                        url={currentTheme === 'light' ? lightTileUrl : darkTileUrl}
                                    />
                                    {mapLocationData.map((location) => (
                                        <CircleMarker
                                            key={location.name}
                                            center={location.coordinates}
                                            pathOptions={{ 
                                                color: riskColorMap[location.risk], 
                                                fillColor: riskColorMap[location.risk], 
                                                fillOpacity: 0.7 
                                            }}
                                            radius={10}
                                        >
                                            <Popup>
                                                <div className="font-sans text-gray-800">
                                                    <h3 className="font-bold text-base mb-1">{location.name}</h3>
                                                    <p><strong className="font-semibold">Risk:</strong> <span style={{color: riskColorMap[location.risk]}}>{location.risk}</span></p>
                                                    <p><strong className="font-semibold">Outbreaks:</strong> {location.outbreaks}</p>
                                                    <p><strong className="font-semibold">Pending:</strong> {location.pendingReports}</p>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    ))}
                                </MapContainer>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={diseaseTrendsChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                     <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-3">
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('water_quality_metrics')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center">
                                <span className="text-gray-600 dark:text-gray-400">{t('avg_ph')}</span>
                                <span className="ml-auto font-bold text-lg text-gray-900 dark:text-white">7.2</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-600 dark:text-gray-400">{t('avg_turbidity')}</span>
                                <span className="ml-auto font-bold text-lg text-gray-900 dark:text-white">0.5 NTU</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-600 dark:text-gray-400">{t('bacterial_presence')}</span>
                                <span className="ml-auto font-bold text-lg text-green-600 dark:text-green-400">{t('negative')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;