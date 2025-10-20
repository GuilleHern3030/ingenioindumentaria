import axios from 'axios';
import { apiUrl as api } from '../config.json'

const instance = axios.create({
  baseURL: api
});

export const apiUrl = api;

export default instance;