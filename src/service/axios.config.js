import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Puedes agregar interceptores aquí para manejar errores globales
instance.interceptors.response.use(
  response => response,
  error => {
    // Manejo global de errores
    return Promise.reject(error);
  }
);

export default instance;



{/*import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;*/}
