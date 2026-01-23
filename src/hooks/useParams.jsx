import { useState, useEffect } from 'react'

/**
 * Get the query params in object format
 * @param {string} excludes params excluded
 * @returns {Record<string, string>} params in object format
 */
export const getParams = (...excludes) => {
    const params = {}
    const search = new URLSearchParams(window.location.href.substring(window.location.href.indexOf('?') + 1))
    search.forEach((value, key) => {
        if (value && !excludes.includes(key)) params[key] = value
    })
    return params
}

/**
 * Get any query params
 * @param {string} queryParams params to get
 * @returns {Record<string, string>} params in object format
 */
export const getParam = (...queryParams) => {
    const params = {}
    const search = new URLSearchParams(window.location.href.substring(window.location.href.indexOf('?') + 1))
    search.forEach((value, key) => {
        if (value && queryParams.includes(key)) params[key] = value
    })

    const result = (obj) => {
        try { return JSON.parse(obj) } 
        catch(e) { return obj }
    }

    return (Object.keys(params).length > 1) ? params 
        : (Object.keys(params).length == 1) ? result(params[queryParams[0]])
            : undefined
}

export const queryParams = () => {
    const params = []
    Object.entries(getParams()).forEach(([key, value]) => {
        params.push(`${key}=${value}`)
    })
    return params.length > 0 ? '?' + params.join('&') : ''
}

export const getSlug = (basename) => {
    const url = location.pathname
    const index = basename?.length ?? 0;
    return url.substring(index);
}

export default () => {

    const [ params, setParams ] = useState(getParams() || {})

    useEffect(() => { setParams(getParams()) }, [])

    return params
}
