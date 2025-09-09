import type { Report, ChartDataPoint, LocationData } from './types';

export const communityReportsData: Report[] = [
    { 
        id: 'RPT-NE-001', location: 'Guwahati, Assam', coordinates: [26.1445, 91.7362], date: '2023-08-15', status: 'Submitted',
        submittedBy: 'CHW #12', details: 'Patient reported high fever and severe dehydration in a remote village. Samples collected for cholera testing.',
        age: 34, gender: 'Male', symptoms: ['High Fever', 'Dehydration', 'Vomiting']
    },
    { 
        id: 'RPT-NE-002', location: 'Shillong, Meghalaya', coordinates: [25.5788, 91.8933], date: '2023-08-16', status: 'Reviewed',
        submittedBy: 'CHW #8', details: 'Case of Typhoid confirmed. Patient has started medication. Community awareness drive initiated.',
        age: 25, gender: 'Female', symptoms: ['Fever', 'Headache', 'Stomach Pain']
    },
    { 
        id: 'RPT-NE-003', location: 'Agartala, Tripura', coordinates: [23.8315, 91.2868], date: '2023-08-17', status: 'Pending',
        submittedBy: 'CHW #21', details: 'Multiple cases of jaundice reported near a river. Water source contamination suspected.',
        age: 45, gender: 'Male', symptoms: ['Jaundice', 'Fatigue']
    },
    { 
        id: 'RPT-NE-004', location: 'Itanagar, Arunachal Pradesh', coordinates: [27.0844, 93.6053], date: '2023-08-18', status: 'Submitted',
        submittedBy: 'CHW #5', details: 'Suspected case of Dengue fever. Patient advised to take a blood test.',
        age: 19, gender: 'Female', symptoms: ['High Fever', 'Rash', 'Joint Pain']
    },
    { 
        id: 'RPT-NE-005', location: 'Aizawl, Mizoram', coordinates: [23.7271, 92.7176], date: '2023-08-19', status: 'Reviewed',
        submittedBy: 'CHW #33', details: 'Patient tested negative for Malaria. General viral fever. No further action needed.',
        age: 52, gender: 'Male', symptoms: ['Fever', 'Body Ache']
    },
    { 
        id: 'RPT-NE-006', location: 'Kohima, Nagaland', coordinates: [25.6751, 94.1022], date: '2023-08-20', status: 'Pending',
        submittedBy: 'CHW #15', details: 'Report of contaminated water from a community well. Urgent attention required.',
        age: 30, gender: 'Female', symptoms: ['Diarrhea']
    },
];

const diseaseTrendsChartDataBase = {
    incidence: [
        { name: 'Jan', value: 250 }, { name: 'Feb', value: 300 }, { name: 'Mar', value: 450 },
        { name: 'Apr', value: 400 }, { name: 'May', value: 650 }, { name: 'Jun', value: 800 },
        { name: 'Jul', value: 950 },
    ],
    geo: [
        { name: 'Assam', value: 1200 }, { name: 'Tripura', value: 980 }, { name: 'Meghalaya', value: 800 },
        { name: 'Mizoram', value: 750 }, { name: 'Nagaland', value: 600 }, { name: 'Arunachal', value: 550 },
        { name: 'Manipur', value: 320 },
    ],
    age: [
        { name: '0-10', value: 400 }, { name: '11-20', value: 600 }, { name: '21-30', value: 900 },
        { name: '31-40', value: 700 }, { name: '41-50', value: 550 }, { name: '51-60', value: 450 },
        { name: '61+', value: 200 },
    ],
};

// FIX: Export 'diseaseTrendsChartData' which was missing. This data is used by the dashboard chart.
export const diseaseTrendsChartData: ChartDataPoint[] = diseaseTrendsChartDataBase.incidence;

// Function to generate slightly varied data
const generateVariedData = (baseData: ChartDataPoint[], factor: number) => 
    baseData.map(item => ({ ...item, value: Math.round(item.value * (factor + (Math.random() - 0.5) * 0.2)) }));

export const diseaseDataByLocation = {
    'All NE': {
        incidence: diseaseTrendsChartDataBase.incidence,
        geo: diseaseTrendsChartDataBase.geo,
        age: diseaseTrendsChartDataBase.age,
    },
    'Assam': {
        incidence: generateVariedData(diseaseTrendsChartDataBase.incidence, 1.2),
        geo: generateVariedData(diseaseTrendsChartDataBase.geo, 1.2),
        age: generateVariedData(diseaseTrendsChartDataBase.age, 1.1),
    },
    'Tripura': {
        incidence: generateVariedData(diseaseTrendsChartDataBase.incidence, 0.9),
        geo: generateVariedData(diseaseTrendsChartDataBase.geo, 0.9),
        age: generateVariedData(diseaseTrendsChartDataBase.age, 0.95),
    },
    'Meghalaya': {
        incidence: generateVariedData(diseaseTrendsChartDataBase.incidence, 0.7),
        geo: generateVariedData(diseaseTrendsChartDataBase.geo, 0.7),
        age: generateVariedData(diseaseTrendsChartDataBase.age, 0.8),
    },
    'Mizoram': {
        incidence: generateVariedData(diseaseTrendsChartDataBase.incidence, 0.6),
        geo: generateVariedData(diseaseTrendsChartDataBase.geo, 0.6),
        age: generateVariedData(diseaseTrendsChartDataBase.age, 0.7),
    },
    'Nagaland': {
        incidence: generateVariedData(diseaseTrendsChartDataBase.incidence, 0.5),
        geo: generateVariedData(diseaseTrendsChartDataBase.geo, 0.5),
        age: generateVariedData(diseaseTrendsChartDataBase.age, 0.6),
    },
    'Arunachal Pradesh': {
        incidence: generateVariedData(diseaseTrendsChartDataBase.incidence, 0.4),
        geo: generateVariedData(diseaseTrendsChartDataBase.geo, 0.4),
        age: generateVariedData(diseaseTrendsChartDataBase.age, 0.5),
    }
};

export const phLevelChartData: ChartDataPoint[] = [
    { name: '4W Ago', value: 7.0 },
    { name: '3W Ago', value: 7.1 },
    { name: '2W Ago', value: 7.05 },
    { name: '1W Ago', value: 7.15 },
    { name: 'Today', value: 7.2 },
];

export const mapLocationData: LocationData[] = [
    { name: 'Guwahati, Assam', coordinates: [26.1445, 91.7362], outbreaks: 1, pendingReports: 1, risk: 'High' },
    { name: 'Shillong, Meghalaya', coordinates: [25.5788, 91.8933], outbreaks: 0, pendingReports: 0, risk: 'Low' },
    { name: 'Agartala, Tripura', coordinates: [23.8315, 91.2868], outbreaks: 1, pendingReports: 1, risk: 'High' },
    { name: 'Itanagar, Arunachal Pradesh', coordinates: [27.0844, 93.6053], outbreaks: 0, pendingReports: 0, risk: 'Medium' },
    { name: 'Aizawl, Mizoram', coordinates: [23.7271, 92.7176], outbreaks: 0, pendingReports: 0, risk: 'Low' },
    { name: 'Kohima, Nagaland', coordinates: [25.6751, 94.1022], outbreaks: 1, pendingReports: 1, risk: 'High' },
    { name: 'Imphal, Manipur', coordinates: [24.8170, 93.9368], outbreaks: 0, pendingReports: 0, risk: 'Low' },
    { name: 'Gangtok, Sikkim', coordinates: [27.3389, 88.6065], outbreaks: 0, pendingReports: 0, risk: 'Low' },
];
