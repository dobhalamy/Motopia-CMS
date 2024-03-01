import axios from 'axios';

export const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CUSTOMER_BASE_URL = process.env.REACT_APP_CUSTOMER_BE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

export const customerAPI = axios.create({
  baseURL: CUSTOMER_BASE_URL,
});

export default api;
