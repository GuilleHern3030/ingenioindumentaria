import { useIndexedDB, cacheTime } from './config.json'
import backend from './backend.js'
import indexedDB from './indexedDB'
export default (forceIndexedDB?:boolean) => (useIndexedDB == true || forceIndexedDB && forceIndexedDB === true) ? indexedDB : backend

export { default as indexedDB } from './indexedDB.js'
export { default as backendDB } from './backend.js'

import { pull, getIndex } from './indexedDB.js'
export const loadDataBase = async() => {
    if (useIndexedDB) 
        return pull()
}

export const loadIndex = async() => {
    if (useIndexedDB) 
        return getIndex()
}

const KEY = 'tmp-token'
const USER = 'tmp-user'
const CACHE = 'cache-timeStamp'

export const getLocalToken = () => sessionStorage.getItem(KEY)
export const setLocalToken = (token:string) => sessionStorage.setItem(KEY, token != undefined ? token : "")
export const removeLocalToken = () => sessionStorage.removeItem(KEY)

export const getLocalUser = () => sessionStorage.getItem(USER)
export const setLocalUser = (user:string) => sessionStorage.setItem(USER, user != undefined ? user : "")
export const removeLocalUser = () => sessionStorage.removeItem(USER)

export const isSignedIn = () =>
    sessionStorage.getItem(KEY) != null || sessionStorage.getItem(USER) != null

export const setCache = () => window.localStorage.setItem(CACHE, new Date().toISOString())
export const isValidCache = () => {
    const timeStamp = window.localStorage.getItem(CACHE)
    if (timeStamp != null && !isSignedIn() && useIndexedDB == true) try {
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