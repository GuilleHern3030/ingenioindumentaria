import axios from '../axios.ts'
import api from '../../config.json'
import { devMode } from '../../../api'
const endpoint = "/articles";

/**
 * Gets the articles in JSON format
 * @returns Promise with a JSON of articles
 */
export default async function():Promise<any> {
  return fetchLocalArticles()
    .catch(() => fetchGoogleSheetsV4())
    .catch(() => getArticles()) 
}

export const getArticles = async (force?:boolean) => {
  if (force !== true && api.loadFromBackend !== undefined && api.loadFromBackend === false) throw new Error("Backend Service storage is not allowed")
    const { data } = await axios.get(endpoint)
    return data;
}

export const fetchGoogleSheetsV4 = async (): Promise<Record<string, string>[]> => {
  if (api.loadFromGoogleSheets !== undefined && api.loadFromGoogleSheets === false) throw new Error("Google Sheet storage is not allowed")

  const sheetName = devMode() === true ? 'test' : api.googleSheetsName

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${api.googleSheetsId}/values/${sheetName}?key=${api.googleSheetsApiKey}`
  );
  const json = await res.json();
  const rows: string[][] = json.values;

  if (!rows || rows.length === 0) return [];

  const headers = rows.shift();
  if (!headers) return [];

  const objectStores = rows.map((row) => {
    const objectStore: Record<string, string> = {};

    headers.forEach((header, index) => {
      objectStore[header] = row[index] ?? "";
    });

    return objectStore;
  });

  return objectStores;
}

export const fetchLocalArticles = async (): Promise<Record<string, string>[]> => {
  if (api.loadFromLocalStorage !== undefined && api.loadFromLocalStorage === false) throw new Error("Local storage is not allowed")
  return fetch(api.localStorage).then(res => res.json())
}
