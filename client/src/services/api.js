import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// İstek öncesi token ekle
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Kullanıcı işlemleri
export const register = (username, password) => {
  return apiClient.post('/register', { username, password });
};

export const login = (username, password) => {
  return apiClient.post('/login', { username, password });
};

export const getProfile = () => {
  return apiClient.get('/profile');
};

// Dosya işlemleri
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getFiles = () => {
  return apiClient.get('/files');
};

export const deleteFile = (fileId) => {
  return apiClient.delete(`/files/${fileId}`);
};

export default {
  register,
  login,
  getProfile,
  uploadFile,
  getFiles,
  deleteFile
}; 