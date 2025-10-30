import { createContext, useRef, useEffect, useState } from 'react';
import { loadDataBase, loadShoppingCart, setCache, isValidCache, devMode } from '../api';
import { useDispatch } from 'react-redux';

import { setIndex } from '../redux/reducers/index/indexSlice'
import { setShoppingCart } from '../redux/reducers/shoppingcart/shoppingcartSlice'

export const DataBaseContext = createContext()
const MAX_TRIES = 3

export function DataBaseContextProvider(props) {

    const initialized = useRef(false)

    const dispatch = useDispatch()

    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (initialized.current) return; // evita múltiples ejecuciones
        initialized.current = true;

        loadData()

        if (devMode() === true)
            console.warn("Development mode", "No database access")

    }, [])

    const loadData = async(tries=0) => {

        if (tries < MAX_TRIES) try {
            //setIsLoading(true)
            const articles = await loadDataBase(isValidCache())
            if (isValidCache()) console.warn("Loaded from cache")
            console.log("Loaded:\n", articles)
            setCache()
            setIsLoading(false)
            dispatch(setShoppingCart(articles.shoppingCart))
            dispatch(setIndex(articles.index))
        } catch(err) {
            tries ++
            console.error(`(${tries}/${MAX_TRIES})`, err)
            setTimeout(() => loadData(tries), 5000) // retry in 5s
        } else { // Fails in laod
            console.error(`FAIL IN LOAD DATA`)
            setIsLoading(null)
        }
    }

    return (<>
        <DataBaseContext.Provider value = {{ isLoading }}>
            {props.children}
        </DataBaseContext.Provider>
    </>)
}