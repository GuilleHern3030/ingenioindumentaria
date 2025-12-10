import { googleSheetsName, googleSheetsId, googleSheetsApiKey, localStorage, loadFromBackend, loadFromGoogleSheets, loadFromLocalStorage, lazyLoading, lazyLoadLimit } from '@/api/config.json'
import { email, language, axios, devMode, devConsole } from '@/api'
import query from '@/utils/QueryUtils';

const endpoint = "/articles/pull";

/**
 * Get products in JSON format
 * @returns Promise with a JSON of products
 */
export default async function():Promise<any> {
  return localPull()
    .catch(() => googleSheetsV4Pull())
    .catch(() => backendPull())
}

export const backendPull = async(force?:boolean, forceAll=!lazyLoading) => {
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
  .then(json => v4Json(json))
  .then(v4Json => merge(v4Json))
  return data
}

const v4Json = (json:any):Record<string, any> => {
  
  const rows: string[][] = json.values;
  console.log(rows)

  const object = {}
  let key = undefined
  let header = []
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    if (row.length == 1) { // title
      if (row[0] == '-----END-----')
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

const merge = (v4Json:Record<string, any>):Record<string, any> => {
  if (v4Json.articles?.length > 0 && v4Json.variants?.length > 0) {

    const indexOf = (id:number) => {
      for (let i = 0; i < v4Json.articles.length; i++) {
        if (v4Json.articles[i].id == id)
          return i
      }
    }

    v4Json.variants.forEach((variant:Record<string, any>) => {
      v4Json.articles[indexOf(variant.ProductId)].ProductVariants.push(variant)
    })

    delete v4Json.variants

  } return v4Json
}