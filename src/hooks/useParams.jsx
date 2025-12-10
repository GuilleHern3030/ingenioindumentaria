import { useState, useEffect } from 'react'

export const getParams = () => {
    const params = {}
    const search = new URLSearchParams(window.location.href.substring(window.location.href.indexOf('?') + 1))
    search.forEach((value, key) => {
        if (value) params[key] = value
    })
    return params
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
