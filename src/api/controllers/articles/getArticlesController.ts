import api from '../../config.json'
const endpoint = "/articles";

/**
 * Gets the articles in JSON format
 * @returns Promise with a JSON of articles
 */
export default async function():Promise<any> {
  if (!(window.location.href).includes("localhost"))
    return fetch(api.localData).then(res => res.json())
      .catch(() => fetchGoogleSheetsV4())
  else return fetchGoogleSheetsV4()
};

const fetchGoogleSheetsV4 = async (): Promise<Record<string, string>[]> => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${api.googleSheetsId}/values/${api.googleSheetsName}?key=${api.googleSheetsApiKey}`
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
};