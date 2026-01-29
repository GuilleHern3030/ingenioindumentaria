import { createContext, useRef, useEffect, useState } from 'react';
import { devMode, loadDataBase } from '@/api';

import { init as initIndexedDB, getCart as indexedCart } from '@/redux/database/indexedDB'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export const DataBaseContext = createContext()
const MAX_TRIES = 3

export function DataBaseContextProvider(props) {

    const online = useOnlineStatus()

    const initialized = useRef(false)

    const [ isInitializing, setIsInitalizing ] = useState(true)

    // Articles
    const [ categories, setCategories ] = useState([])
    const [ attributes, setAttributes ] = useState([])
    const [ hasPromos, setHasPromos ] = useState(false)
    const [ hasNewest, setHasNewest ] = useState(false)
    const [ articles, setArticles ] = useState([])

    // Cart
    const [ cart, setCart ] = useState([])

    useEffect(() => {
        if (initialized.current) return; // evita múltiples ejecuciones
        initialized.current = true;
        init()
    }, [])

    useEffect(() => {
        if (isInitializing === null && online === true) {
            console.warn("ONLINE MODE\nReloading data")
            init()
        }
    }, [ online ])

    const loadData = async(forceCache) => {
        const { articles, categories, attributes, cart } = await loadDataBase(forceCache)
        const { hasDiscounts, hasNewests } = reduceArticles(articles)
        setCategories(categories)
        setAttributes(attributes)
        setHasPromos(hasDiscounts)
        setHasNewest(hasNewests)
        setArticles(articles)
        await initIndexedDB(categories, attributes, articles, cart)
        setCart(await indexedCart())
    }

    const init = async(tries=0) => {

        try {
            if (tries < MAX_TRIES) { 
                await loadData()
                if (!online) {
                    setIsInitalizing(null)
                    console.warn(`Unable to access data, using local data and waiting for online to reload`)
                } else setIsInitalizing(false)
            }
            else if (tries === MAX_TRIES) {// Service unavailable -> try cached
                await loadData(true)
                console.warn(`SERVICE UNAVAILABLE`)
                setIsInitalizing(null)
            }
            else { // Fails in laod
                console.error(`FAIL IN LOAD DATA`)
                setIsInitalizing(null)
            }
        } catch(err) {
            tries ++
            console.error(`(${tries}/${MAX_TRIES})`, err)
            setTimeout(() => init(tries), (devMode() === true) ? 50 : 3000) // retry in 3s
        } 
    }

    return (<>
        <DataBaseContext.Provider value = {
            { 
                isInitializing, 
                init, 
                hasPromos,
                hasNewest,
                categories,
                attributes,
                articles,
                cart, setCart
            }
        }>
            {props.children}
        </DataBaseContext.Provider>
    </>)
}

const reduceArticles = (articles) => {
    const hasDiscounts = articles.find(article => article.discount > 0) != undefined
    const hasNewests = articles.find(article => article.newest === true) != undefined
    return {
        hasDiscounts,
        hasNewests,
        articles
    }
}