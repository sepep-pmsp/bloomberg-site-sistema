import axios from 'axios';

const side = axios.create({
  baseURL: 'http://10.80.14.29:3001',
  withCredentials: true 
});

side.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default side;