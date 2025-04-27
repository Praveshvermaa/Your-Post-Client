// src/api/axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://your-post-backend.onrender.com', // 🛠️ Your backend URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
