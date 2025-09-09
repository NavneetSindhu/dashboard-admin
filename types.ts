
export interface Report {
    id: string;
    location: string;
    coordinates: [number, number];
    date: string;
    status: 'Submitted' | 'Reviewed' | 'Pending';
    submittedBy: string;
    details: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    symptoms: string[];
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface LocationData {
    name: string;
    coordinates: [number, number];
    outbreaks: number;
    pendingReports: number;
    risk: 'High' | 'Medium' | 'Low';
}
