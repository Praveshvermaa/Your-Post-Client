
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://your-post-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
