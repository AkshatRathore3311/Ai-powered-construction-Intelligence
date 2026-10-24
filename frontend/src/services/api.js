import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 35000, // 35 seconds to allow vision model inference
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for unified error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred while communicating with the server.';
    if (error.response) {
      // Backend returned HTTP error
      message = error.response.data?.detail || `Server error (${error.response.status})`;
    } else if (error.request) {
      // No response received (Backend down or CORS failure)
      message = 'Cannot connect to FastAPI backend server. Ensure backend is running on ' + API_BASE_URL;
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

/**
 * Utility helper to convert a Base64 dataURL or remote sample image into a real File object
 * so that 1-click sample images can be submitted as authentic multipart/form-data.
 */
export async function dataUrlToFile(dataUrlOrUrl, filename = 'sample_inspection.jpg') {
  if (dataUrlOrUrl.startsWith('data:')) {
    const arr = dataUrlOrUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } else {
    // Remote sample image URL - fetch as blob
    const res = await fetch(dataUrlOrUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  }
}

// API Service Methods
export const api = {
  // System Health
  getHealth: async () => {
    const res = await apiClient.get('/api/health');
    return res.data;
  },

  // 1. Safety Monitoring
  analyzeSafety: async (imageFileOrBlob, siteName = 'Metro Heights Tower A') => {
    const formData = new FormData();
    formData.append('image', imageFileOrBlob);
    formData.append('site_name', siteName);

    const res = await apiClient.post('/api/safety/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // 2. Structural Crack Detection
  analyzeCracks: async (imageFileOrBlob, elementType = 'column', siteName = 'Metro Heights Tower A') => {
    const formData = new FormData();
    formData.append('image', imageFileOrBlob);
    formData.append('element_type', elementType);
    formData.append('site_name', siteName);

    const res = await apiClient.post('/api/cracks/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // 3. Real Estate Valuation
  estimateValuation: async (payload) => {
    const res = await apiClient.post('/api/valuation/estimate', payload);
    return res.data;
  },

  // 4. Project Planning
  generatePlan: async (payload) => {
    const res = await apiClient.post('/api/planning/generate', payload);
    return res.data;
  },

  // 5. Knowledge Assistant
  chatAssistant: async (message, contextTopic = 'construction_codes') => {
    const res = await apiClient.post('/api/assistant/chat', {
      message,
      context_topic: contextTopic,
    });
    return res.data;
  },

  // 6. Daily Site & Weather Telemetry
  getWeather: async (lat, lon, city) => {
    const params = {};
    if (lat !== undefined) params.latitude = lat;
    if (lon !== undefined) params.longitude = lon;
    if (city) params.city = city;

    const res = await apiClient.get('/api/weather/current', { params });
    return res.data;
  },

  // 7. Analysis History
  getAnalyses: async () => {
    const res = await apiClient.get('/api/analyses');
    return res.data;
  },
};
