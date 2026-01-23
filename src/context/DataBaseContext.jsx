import { createContext, useRef, useEffect, useState } from 'react';
import { devMode, loadDataBase } from '@/api';

import { init as initIndexedDB, getCart as indexedCart } from '@/redux/database/indexedDB'

export const DataBaseContext = createContext()
const MAX_TRIES = 3

export function DataBaseContextProvider(props) {

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

    const init = async(tries=0) => {

        if (tries < MAX_TRIES) try {

            const { articles, categories, attributes, cart } = await loadDataBase()
            const { hasDiscounts, hasNewests } = reduceArticles(articles)
            setCategories(categories)
            setAttributes(attributes)
            setHasPromos(hasDiscounts)
            setHasNewest(hasNewests)
            setArticles(articles)
            await initIndexedDB(categories, attributes, articles, cart)
            setCart(await indexedCart())
            setIsInitalizing(false)

        } catch(err) {
            tries ++
            if (devMode() === true) tries = MAX_TRIES
            console.error(`(${tries}/${MAX_TRIES})`, err)
            setTimeout(() => init(tries), 3000) // retry in 3s
        } else { // Fails in laod
            console.error(`FAIL IN LOAD DATA`)
            setIsInitalizing(null)
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