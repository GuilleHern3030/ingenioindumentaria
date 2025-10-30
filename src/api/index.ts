import { useIndexedDB, cacheTime, adminSignTime } from './config.json'
import backend from './backend.js'
import indexedDB from './indexedDB'
export default (forceIndexedDB?:boolean) => (useIndexedDB == true || forceIndexedDB && forceIndexedDB === true) ? indexedDB : backend

export { default as indexedDB } from './indexedDB.js'
export { default as backendDB } from './backend.js'

import { pull, getIndex } from './indexedDB.js'

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

const KEY = 'tmp-token'
const ADMIN = 'tmp-admin-user'
const WAS_ADMIN = 'was-admin'
const CACHE = 'cache-timeStamp'
const ADMIN_SIGN_TIME = 'admin-sign-time'

export const devMode = () => location.hostname.includes("localhost")

export const getLocalToken = () => sessionStorage.getItem(KEY)
export const setLocalToken = (token:string) => sessionStorage.setItem(KEY, token != undefined ? token : "")
export const removeLocalToken = () => sessionStorage.removeItem(KEY)

export const getAdminUser = () => sessionStorage.getItem(ADMIN)
export const setAdminUser = (user:string) => sessionStorage.setItem(ADMIN, user != undefined ? user : "")
export const removeAdminUser = () => sessionStorage.removeItem(ADMIN)

export const wasAdminSignedIn = () => localStorage.getItem(WAS_ADMIN) != null
export const setWasAdminSignedIn = () => localStorage.setItem(WAS_ADMIN, "yes")

export const setAdminSignedIn = (signedIn:boolean) => signedIn ? sessionStorage.setItem(ADMIN_SIGN_TIME, new Date().toISOString()) : sessionStorage.removeItem(ADMIN_SIGN_TIME)
export const isAdminSignedIn = () => {
    const timeStamp = sessionStorage.getItem(ADMIN_SIGN_TIME)
    if (timeStamp != null) try {
        const now:any = new Date()
        const saved:any = new Date(timeStamp)
        const diffMinutes = Math.floor((now - saved) / 60000);
        return diffMinutes < adminSignTime
    } catch(e) { }
    removeAdminUser()
    removeLocalToken()
    setAdminSignedIn(false)
    return false
}

export const setCache = () => window.localStorage.setItem(CACHE, new Date().toISOString())

export const isValidCache = () => {
    const timeStamp = window.localStorage.getItem(CACHE)
    if (timeStamp != null && !isAdminSignedIn() && useIndexedDB == true) try {
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