import { cacheTime } from './config.json'
import { pull } from './articles'

import { pull as cachePull } from '@/redux/database/indexedDB'
import { isAdmin } from './users'

export { default as axios } from './controllers/axios'
export { email, isAdmin } from './users'
export { language } from '@/utils/i18n'

export const devMode = () => location.hostname.includes("localhost") || location.hostname.includes("192.168.1")

export const devConsole = (...params:any[]) => {
    if (devMode())
        return console.log(...params)
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
    const timeStamp = window.localStorage.getItem(CACHE)
    if (timeStamp != null) try {
        const now:any = new Date()
        const saved:any = new Date(timeStamp)
        const diffMinutes = Math.floor((now - saved) / 60000);
        return diffMinutes < cacheTime
    } catch (e) { }
    return false
}

export const loadDataBase = async() => {
    if (!isValidCache()) {
        console.time("Data loaded")
        const data = await pull()
        console.timeEnd("Data loaded")
        if(!devMode() && !isAdmin()) 
            setCache()
        console.log("Loaded:\n", data)
        return data
    } else {
        console.time("Cache loaded")
        const data = await cachePull()
        console.timeEnd("Cache loaded")
        console.warn("Cache loaded:\n", data)
        return data
    }
}