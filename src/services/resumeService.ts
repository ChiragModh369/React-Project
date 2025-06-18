import axios from 'axios';
import { Resume } from '@/types/resumeTypes';
import { BASE_API_URL } from '@/redux/config';
import { showLog } from '@/commonFunctions/Functions';


export const enhanceWithAI = async (resume: Resume, jobDescription?: string) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/resume/enhance`, {
      resume,
      jobDescription
    });
    return response.data;
  } catch (error) {
    console.error('Error enhancing resume:', error);
    throw new Error('Failed to enhance resume with AI');
  }
};

export const generatePDF = async (renderedHTML: string) => {
  showLog('Generating PDF with rendered HTML:', renderedHTML);
  try {
    const response = await axios.post(
      `${BASE_API_URL}generateResume`,
      { html: renderedHTML },
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const saveResume = async (resume: Resume) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/resume/save`, resume);
    return response.data;
  } catch (error) {
    console.error('Error saving resume:', error);
    throw new Error('Failed to save resume');
  }
};

export const getResume = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/resume/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw new Error('Failed to fetch resume');
  }
};