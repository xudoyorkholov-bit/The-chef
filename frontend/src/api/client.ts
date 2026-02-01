import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to convert MongoDB _id to id
const convertMongoId = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => convertMongoId(item));
  }
  
  if (obj && typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      if (key === '_id') {
        converted.id = obj[key];
        converted._id = obj[key]; // Keep _id as well for compatibility
      } else if (typeof obj[key] === 'object') {
        converted[key] = convertMongoId(obj[key]);
      } else {
        converted[key] = obj[key];
      }
    }
    return converted;
  }
  
  return obj;
};

// Response interceptor for error handling and MongoDB _id conversion
apiClient.interceptors.response.use(
  (response) => {
    // Convert _id to id in response data
    if (response.data) {
      response.data = convertMongoId(response.data);
    }
    return response;
  },
  (error) => {
    // Only redirect to auth on 401 if it's not a file upload error
    if (error.response?.status === 401) {
      // Check if this is a token-related auth error (not a validation error)
      const errorMessage = error.response?.data?.error || '';
      if (errorMessage.toLowerCase().includes('unauthorized') || 
          errorMessage.toLowerCase().includes('token') ||
          errorMessage.toLowerCase().includes('authentication')) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
