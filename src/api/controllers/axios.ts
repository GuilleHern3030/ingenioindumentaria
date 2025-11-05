import axios from 'axios';
import { apiUrl as api } from '../config.json'

const baseURL = location.hostname.includes("localhost") ? 
  "http://localhost:5431" : api

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export const apiUrl = api;

export default instance;