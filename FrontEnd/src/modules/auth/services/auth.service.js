import axios from 'axios';

const side = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true
});

export default side;