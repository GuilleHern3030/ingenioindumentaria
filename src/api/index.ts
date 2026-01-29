import { cacheTime } from './config.json'
import { pull } from './articles'

import { pull as cachePull } from '@/redux/database/indexedDB'
import { isAdmin } from './users'

export { default as axios } from './controllers/axios'
export { email, isAdmin, admin } from './users'
export { language } from '@/utils/i18n'

export const devMode = () => location.hostname.includes("localhost") || location.hostname.includes("192.168.1")

export const devConsole = (...params:any[]) => {
    if (devMode())
        return console.log("%cDevConsole\n", "color:yellow;", ...params)
}

export const request = async(setIsLoading:Function, setError:Function, fetchFunction:Function, ...params:any) => new Promise((resolve, reject) => {
    setIsLoading(true)
    setError(undefined)
    fetchFunction(...params)
    .then((response:any) => {
        setIsLoading(false)
        setError(undefined)
        resolve(response)
    })
    .catch((e:any) => {
        setError(e.toString())
        setIsLoading(false)
        reject(e)
    })
})

export const reload = (params?:string) => {
    window.location.href = (typeof(params) !== 'string' || params == 'undefined') ? 
        window.location.href.split('?')[0] :
        window.location.href.split('?')[0] + `?${params}`;
}

const CACHE = 'cache-timeStamp'

export const setCache = () => window.localStorage.setItem(CACHE, new Date().toISOString())

export const clearCache = () => window.localStorage.removeItem(CACHE)

export const isValidCache = () => {
    if (isAdmin()) return false
    const timeStamp = window.localStorage.getItem(CACHE)
    if (timeStamp != null) try {
        const now:any = new Date()
        const saved:any = new Date(timeStamp)
        const diffMinutes = Math.floor((now - saved) / 60000);
        return diffMinutes < cacheTime
    } catch (e) { }
    return false
}

export const loadDataBase = async(forceCache?:boolean) => {
    if (!isValidCache() && navigator.onLine && forceCache !== true) {
        devConsole("Fetching actualized data")
        console.time("Data loaded in")
        const data = await pull()
        console.timeEnd("Data loaded in")
        if(!devMode() && !isAdmin()) 
            setCache()
        if(devMode() || isAdmin()) 
            console.log("%cLoaded:\n", "color:lightgreen;", data)
        return data
    } else {
        if (!navigator.onLine) console.warn("OFFLINE MODE")
        console.time("Cache loaded in")
        const data = await cachePull()
        console.timeEnd("Cache loaded in")
        if(devMode() || isAdmin()) 
            console.log("%cCache loaded:\n", "color:yellow;", data)
        return data
    }
}