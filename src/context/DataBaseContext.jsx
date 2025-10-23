import { createContext, useRef, useEffect, useState } from 'react';
import { pull as loadDataBase, getIndex } from '../hooks/useIndexedDB';
import { cacheTime, cacheKey } from '../api/config.json'
import { useDispatch } from 'react-redux';

import { setIndex } from '../redux/reducers/index/indexSlice'

export const DataBaseContext = createContext();

export function DataBaseContextProvider(props) {

    const initialized = useRef(false)

    const dispatch = useDispatch()

    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (initialized.current) return; // evita múltiples ejecuciones
        initialized.current = true;

        if (!isValidCache()) try {
            //setIsLoading(true)
            loadDataBase().then(articles => {
                dispatch(setIndex(articles.index))
                console.log("Loaded:\n", articles)
                createCache()
                setIsLoading(false)
            })
        } catch(err) {
            console.error(err)
            setIsLoading(null)
        } else {
            console.warn("Loaded from cache")
            getIndex().then(index => {
                console.log(index)
                dispatch(setIndex(index))
                setIsLoading(false)
            })
            .catch(e => {
                console.error(err)
                setIsLoading(null)
            })
        }

    }, [])

    return (<>
        <DataBaseContext.Provider value = {{ isLoading }}>
            {props.children}
        </DataBaseContext.Provider>
    </>)
}

const createCache = () => {
    window.localStorage.setItem(cacheKey, new Date().toISOString())
}

const isValidCache = () => {
    const timeStamp = window.localStorage.getItem(cacheKey)
    if (timeStamp != null)  {
        const now = new Date();
        const saved = new Date(timeStamp);
        const diffMinutes = Math.floor((now - saved) / 60000);
        return diffMinutes < cacheTime
    }
    return false
}