import React, { useState, useCallback, useMemo } from 'react';
import { communityReportsData } from '../constants';
import type { Report } from '../types';
import { generateReportInsights } from '../services/geminiService';
import Modal from './Modal';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';
import AiSummaryDisplay from './AiSummaryDisplay';

const statusStyles = {
    Submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Reviewed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

const CommunityReports: React.FC<{ currentTheme: 'light' | 'dark'}> = ({ currentTheme }) => {
    const { t, language } = useTranslation();
    const [reports] = useState<Report[]>(communityReportsData);
    const [locationFilter, setLocationFilter] = useState('All Locations');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [aiInsight, setAiInsight] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const filteredReports = useMemo(() => {
        return reports
            .filter(report => {
                if (locationFilter === 'All Locations') return true;
                return report.location.includes(locationFilter);
            })
            .filter(report => {
                if (statusFilter === 'All Statuses') return true;
                return report.status === statusFilter;
            });
    }, [reports, locationFilter, statusFilter]);

    const handleGenerateInsights = useCallback(async () => {
        setIsInsightModalOpen(true);
        setIsLoading(true);
        setAiInsight('');
        const insight = await generateReportInsights(filteredReports, language);
        setAiInsight(insight);
        setIsLoading(false);
    }, [filteredReports, language]);

    const handleViewDetails = (report: Report) => {
        setSelectedReport(report);
        setIsDetailsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsDetailsModalOpen(false);
        // Delay clearing report to prevent content flicker during modal close animation
        setTimeout(() => setSelectedReport(null), 300);
    }
    
    const exportToCSV = () => {
        const headers = ['Report ID', 'Location', 'Date Submitted', 'Status', 'Submitted By', 'Age', 'Gender', 'Symptoms', 'Details'];
        const csvRows = [headers.join(',')];

        filteredReports.forEach(report => {
            const row = [
                report.id,
                `"${report.location}"`,
                report.date,
                report.status,
                `"${report.submittedBy}"`,
                report.age,
                report.gender,
                `"${report.symptoms.join('; ')}"`,
                `"${report.details.replace(/"/g, '""')}"`, // Escape double quotes
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'community_health_reports.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{t('community_reports_title')}</h1>
                <p className="text-slate-600 dark:text-neutral-400 mt-1">{t('community_reports_desc')}</p>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">{t('location')}</label>
                        <select 
                            id="location" 
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="block w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="All Locations">{t('all_locations')}</option>
                            <option value="Assam">{t('assam')}</option>
                            <option value="Meghalaya">{t('meghalaya')}</option>
                            <option value="Tripura">{t('tripura')}</option>
                            <option value="Arunachal Pradesh">{t('arunachal_pradesh')}</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">{t('status')}</label>
                        <select 
                            id="status" 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="block w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 py-2.5 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="All Statuses">{t('all_statuses')}</option>
                            <option value="Submitted">{t('submitted')}</option>
                            <option value="Reviewed">{t('reviewed')}</option>
                            <option value="Pending">{t('pending')}</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-x-3 pt-6 sm:pt-0">
                     <button
                        onClick={exportToCSV}
                        className="bg-slate-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-700 dark:bg-neutral-600 dark:hover:bg-neutral-500 transition-all duration-300 flex items-center shadow-sm"
                        aria-label="Export data as CSV"
                    >
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2"/> {t('export_csv')}
                    </button>
                    <button
                        onClick={handleGenerateInsights}
                        className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300 flex items-center shadow-sm"
                    >
                        <span className="text-yellow-300 mr-2">✨</span> {t('generate_insights')}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-neutral-700">
                    <thead className="bg-slate-50 dark:bg-neutral-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-300 uppercase tracking-wider">{t('report_id')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-300 uppercase tracking-wider">{t('location')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-300 uppercase tracking-wider">{t('date_submitted')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-300 uppercase tracking-wider">{t('status')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-neutral-300 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-slate-200 dark:divide-neutral-700">
                        {filteredReports.map((report) => (
                            <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-neutral-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{report.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-neutral-400">{report.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-neutral-400">{report.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[report.status]}`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleViewDetails(report)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">{t('view_details')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isInsightModalOpen}
                onClose={() => setIsInsightModalOpen(false)}
                title={t('ai_powered_insights_title')}
            >
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-40">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                         <p className="mt-4 text-slate-600 dark:text-neutral-400">{t('generating_insights_loading')}</p>
                    </div>
                ) : (
                    <AiSummaryDisplay summary={aiInsight} />
                )}
            </Modal>

            {selectedReport && (
                <Modal
                    isOpen={isDetailsModalOpen}
                    onClose={closeModal}
                    title={`${t('details_for')} ${selectedReport.id}`}
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div><strong className="font-semibold text-slate-800 dark:text-neutral-200">{t('location')}:</strong><span className="ml-2 text-slate-600 dark:text-neutral-400">{selectedReport.location}</span></div>
                            <div><strong className="font-semibold text-slate-800 dark:text-neutral-200">{t('date')}:</strong><span className="ml-2 text-slate-600 dark:text-neutral-400">{selectedReport.date}</span></div>
                             <div><strong className="font-semibold text-slate-800 dark:text-neutral-200">{t('submitted_by')}:</strong><span className="ml-2 text-slate-600 dark:text-neutral-400">{selectedReport.submittedBy}</span></div>
                            <div><strong className="font-semibold text-slate-800 dark:text-neutral-200">{t('status')}:</strong> <span className={`ml-2 px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[selectedReport.status]}`}>{selectedReport.status}</span></div>
                            <div><strong className="font-semibold text-slate-800 dark:text-neutral-200">{t('patient_age')}:</strong><span className="ml-2 text-slate-600 dark:text-neutral-400">{selectedReport.age}</span></div>
                            <div><strong className="font-semibold text-slate-800 dark:text-neutral-200">{t('patient_gender')}:</strong><span className="ml-2 text-slate-600 dark:text-neutral-400">{selectedReport.gender}</span></div>
                        </div>
                        <div>
                             <strong className="font-semibold text-slate-800 dark:text-neutral-200">{t('symptoms_reported')}:</strong>
                             <div className="flex flex-wrap gap-2 mt-2">
                                {selectedReport.symptoms.map(symptom => <span key={symptom} className="bg-slate-200 text-slate-800 dark:bg-neutral-700 dark:text-neutral-300 text-xs font-medium px-2.5 py-1 rounded-full">{symptom}</span>)}
                             </div>
                        </div>
                         <div>
                            <strong className="font-semibold text-slate-800 dark:text-neutral-200">{t('details')}:</strong>
                            <p className="mt-1 text-slate-600 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-700/50 p-3 rounded-lg border dark:border-neutral-600">{selectedReport.details}</p>
                        </div>
                         <div className="h-64 rounded-lg overflow-hidden border dark:border-neutral-600">
                             <MapContainer key={currentTheme} center={selectedReport.coordinates} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url={currentTheme === 'light' ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"} />
                                <Marker position={selectedReport.coordinates} />
                            </MapContainer>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CommunityReports;