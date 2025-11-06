import { useIndexedDB, cacheTime, adminSignTime } from './config.json'
import backend from './backend.js'
import indexedDB from './indexedDB'
export default (forceIndexedDB?:boolean) => (useIndexedDB == true || forceIndexedDB && forceIndexedDB === true) ? indexedDB : backend

export { default as indexedDB } from './indexedDB.js'
export { default as backendDB } from './backend.js'

export { email, isAdmin } from './users.ts'

import { pull, getIndex } from './indexedDB.js'

import { isAdmin } from './users.ts'

// returns { articles, index, }
export const loadDataBase = async(onlyIndex?:boolean) => {
    let result:Record<string, any> = { }
    if (useIndexedDB) 
        result = onlyIndex === true ? { index: await getIndex() } : await pull()
    result.shoppingCart = await loadShoppingCart()
    return result
}

export const loadShoppingCart = async() => {

}

const CACHE = 'cache-timeStamp'

export const devMode = () => location.hostname.includes("localhost") || location.hostname.includes("192.168.1")

export const setCache = () => window.localStorage.setItem(CACHE, new Date().toISOString())

export const isValidCache = () => {
    const timeStamp = window.localStorage.getItem(CACHE)
    if (timeStamp != null && !isAdmin() && useIndexedDB == true) try {
        const now:any = new Date()
        const saved:any = new Date(timeStamp)
        const diffMinutes = Math.floor((now - saved) / 60000);
        return diffMinutes < cacheTime
    } catch (e) { }
    return false
}

export const reload = () => {
    window.location.href = window.location.href.split('?')[0] + '?t=' + new Date().getTime();
}