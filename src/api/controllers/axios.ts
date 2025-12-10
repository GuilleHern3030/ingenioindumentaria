import axios from 'axios';
import { apiUrl as api, loadFromGoogleSheets } from '../config.json'

const baseURL = location.hostname.includes("localhost") || location.hostname.includes("192.168.1") ? 
  "http://localhost:5431" : api

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "gs-use": loadFromGoogleSheets
  }
});

export const apiUrl = api;

export default instance;