import { googleSheetsName, googleSheetsId, googleSheetsApiKey, localStorage, loadFromBackend, loadFromGoogleSheets, loadFromLocalStorage, lazyLoading, lazyLoadLimit } from '@/api/config.json'
import { email, language, axios, devMode, devConsole } from '@/api'
import product from '@/api/models/Product';
import query from '@/utils/QueryUtils';

const endpoint = "/articles/pull";

/**
 * Get products in JSON format
 * @returns Promise with a JSON of products
 */
export default async function (): Promise<any> {
  return localPull()
    .catch(() => googleSheetsV4Pull())
    .catch(() => backendPull())
}

export const backendPull = async (force?: boolean, forceAll = !lazyLoading) => {
  if (!navigator.onLine) throw new Error("Backend Service storage is not available (offline)")
  if (force !== true && loadFromBackend !== undefined && loadFromBackend === false) throw new Error("Backend Service storage is not allowed")

  // Establecer parámetros de la query
  const queryParams = query.set({
    force: forceAll === true,
    limit: lazyLoadLimit
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

  return data;
}

export const localPull = async (): Promise<Record<string, string>[]> => {
  if (loadFromLocalStorage !== undefined && loadFromLocalStorage === false) throw new Error("Local storage is not allowed")
  return fetch(localStorage).then(res => res.json())
}

export const googleSheetsV4Pull = async (): Promise<Record<string, string>> => {
  if (loadFromGoogleSheets !== undefined && loadFromGoogleSheets === false) throw new Error("Google Sheet storage is not allowed")

  const sheetName = devMode() === true ? 'test' : googleSheetsName

  const data = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetsId}/values/${sheetName}?key=${googleSheetsApiKey}`
  )
    .then(res => res.json())
    .then(json => new GoogleSheetV4(json))
    .then(sheet => {

      // Separa la tabla en bloques según título
      const v4Json = sheet.split('-----END-----', ';')

      // Junta (merge) articles con variants en caso de que existan
      if (v4Json.articles?.length > 0 && v4Json.variants?.length > 0) {
        v4Json.articles.forEach((article:product) => {
          const variantsData = (article.variants as any[])?.map((id:number) =>
            v4Json.variants.find((variant:any) => variant.id == id)
          )
          article.variants = variantsData
        })
        delete v4Json.variants
      } 
      
      return v4Json

    })
  return data
}

class GoogleSheetV4 {

  #rows: string[][]

  constructor(json: any) {
    this.#rows = json.values
    devConsole("[pullController] GoogleSheet:", this.#rows)
  }

  // Separa en bloques donde se tenga un 'title' (una fila con una sola columna)
  split = (endRows: string, endLine: string): Record<string, any> => {
    const object = {}
    let key = undefined
    let header = []

    const fixRow = (row: string[]) => {
      const endIndex = row.indexOf(endLine)
      return endIndex >= 0 ? row.slice(0, endIndex) : row
    }

    for (let i = 0; i < this.#rows.length; i++) {
      const row = endLine ? fixRow(this.#rows[i]) : this.#rows[i]

      if (row.length == 1) { // title
        if (endRows && row[0] == endRows)
          break;
        key = row[0]
        object[key] = []
        header = []
      }

      else if (header.length == 0) // object keys
        header = row

      else { // object content
        const data = {}
        row.forEach((cell, i) => {
          if ('false' == cell.toLocaleLowerCase())
            data[header[i]] = false
          else if ('true' == cell.toLocaleLowerCase())
            data[header[i]] = true
          else if (cell != '' && !isNaN(Number(cell)))
            data[header[i]] = Number(cell)
          else if (cell.includes('[') || cell.includes('{'))
            data[header[i]] = JSON.parse(cell)
          else if ('' === cell)
            data[header[i]] = null
          else
            data[header[i]] = cell
        })
        object[key].push(data)
      }
    }

    return object
  }



}