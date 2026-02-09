import axios from 'axios';
import { API_CONFIG } from './api.config';

export interface SustainabilityStats {
    totalReports: number;
    totalImpact: number;
    impactPercentage: number;
    daysActive: number;
}

export interface SustainabilityReport {
    meal_type: string;
    reason_for_waste: string;
}

export const submitFoodWasteReport = async (report: SustainabilityReport) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_CONFIG.MAIN_BACKEND_URL}/sustainability/report`,
            report,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting food waste report:', error);
        throw error;
    }
};

export const getUserSustainabilityStats = async (): Promise<SustainabilityStats> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_CONFIG.MAIN_BACKEND_URL}/sustainability/my-stats`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching sustainability stats:', error);
        throw error;
    }
};
