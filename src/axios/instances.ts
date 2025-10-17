import axios from 'axios';
import { API_URL } from '@/constants/api';

export const apiPublicInstance = axios.create({
  baseURL: API_URL,
});

export const apiInstance = axios.create({
  baseURL: API_URL,
});
