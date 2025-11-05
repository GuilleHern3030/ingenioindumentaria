import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default () => {

    const [ params, setParams ] = useState([])

    useEffect(() => {
        const params = {}
        const search = new URLSearchParams(window.location.href.substring(window.location.href.indexOf('?') + 1))
        search.forEach((value, key) => {
            if (value) params[key] = value
        })
        setParams(params)
    }, [])

    return params
}
