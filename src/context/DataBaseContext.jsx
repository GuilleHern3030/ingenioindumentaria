import { createContext, useRef, useEffect, useState } from 'react';
import { loadDataBase, loadIndex, setCache, isValidCache } from '../api';
import { useDispatch } from 'react-redux';

import { setIndex } from '../redux/reducers/index/indexSlice'

export const DataBaseContext = createContext()

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
                setCache()
                setIsLoading(false)
            })
        } catch(err) {
            console.error(err)
            setIsLoading(null)
        } else {
            console.warn("Loaded from cache")
            loadIndex().then(index => {
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