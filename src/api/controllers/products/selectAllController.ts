import { loadFromBackend, loadFromGoogleSheets, loadFromLocalStorage } from '@/api/config.json'
import { googleSheetsName, googleSheetsId, googleSheetsApiKey, localStorage } from '@/api/config.json'
import { email, language, axios, devMode, devConsole } from '@/api'
import query from '@/utils/QueryUtils';

const endpoint = "/products/all";

/**
 * Get products in JSON format
 * @returns Promise with a JSON of products
 */
export default async function(includeDisabled:boolean):Promise<any> {
  return localSelect()
    .catch(() => googleSheetsV4Select())
    .catch(() => backendSelect(includeDisabled)) 
}

export const backendSelect = async(includeDisabled:boolean, force?:boolean) => {
  if (force !== true && loadFromBackend !== undefined && loadFromBackend === false) throw new Error("Backend Service storage is not allowed")
    
    // Establecer parámetros de la query
    const queryParams = query.set({
      disabled: includeDisabled === true
    })

    // Request
    const { data } = await axios.get(endpoint + queryParams,
      {
        headers: {
          user: email(),
          lang: language
        }
      }
    )
    
    devConsole(`products.selectAll(force:${force}, includeDisabled:${includeDisabled})${queryParams}`, data)

    return data;
}

export const googleSheetsV4Select = async (): Promise<Record<string, string>[]> => {
  if (loadFromGoogleSheets !== undefined && loadFromGoogleSheets === false) throw new Error("Google Sheet storage is not allowed")

  const sheetName = devMode() === true ? 'test' : googleSheetsName

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetsId}/values/${sheetName}?key=${googleSheetsApiKey}`
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

export const localSelect = async (): Promise<Record<string, string>[]> => {
  if (loadFromLocalStorage !== undefined && loadFromLocalStorage === false) throw new Error("Local storage is not allowed")
  return fetch(localStorage).then(res => res.json())
}