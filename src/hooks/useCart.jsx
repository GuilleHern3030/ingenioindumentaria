import { useState, useContext, useEffect } from "react"

// Context
import { DataBaseContext } from '@/context/DataBaseContext'

// Api
import { request } from '@/api'

// DataLoaders
import indexedDB from "@/redux/database/indexedDB"
import backend from "@/redux/database/backend"
import IdUtils from "@/utils/IdUtils"

const getArticles = async (ids) => {
    return indexedDB.getArticles(ids)
        .catch(() => backend.getArticles(ids))
        .catch(() => ({ articles: [], size: 0 }))
}

const getArticle = async (id) => {
    return indexedDB.getArticle(id)
        .catch(() => backend.getArticle(id))
}

const addArticle = async (article) => {
    return indexedDB.cart.add(article)
        .catch(() => backend.cart.add(article))
}

const removeArticle = async (article) => {
    return indexedDB.cart.remove(article)
        .catch(() => backend.cart.remove(article))
}

const clearArticles = async (article) => {
    return indexedDB.cart.clear(article)
        .catch(() => backend.cart.clear(article))
}

export default function useCart() {

    const { isInitializing, init, cart, setCart } = useContext(DataBaseContext)

    const [ isLoading, setIsLoading ] = useState(false)

    const [ error, setError ] = useState()

    const add = async (article, quantity = 1, variant = undefined) => {

        const image = variant?.images[0] ?? article.images[0]

        console.clear()
        console.log("article:", article)
        console.log("variant:", variant)

        const cartArticle = {
            id: IdUtils.serialize(article.id, variant?.id),
            quantity,
            snapshot: {
                name: article.name,
                price: variant?.price ?? article.price,
                discount: variant?.discount ?? article.discount,
                image: image?.src,
                attributes: variant?.Attributes
            },
            addedAt: new Date().toISOString()
        }

        console.log("cartArticle:", cartArticle)

        const newCart = await addArticle(cartArticle)

        setCart(newCart)

    }

    const remove = async (article) => {
        const newCart = await removeArticle(article)
        setCart(newCart)
    }

    const clear = () => {
        setCart([])
        return clearArticles()
    }

    const count = () => {
        let total = 0
        cart.forEach(article => { total += article.quantity })
        return total;
    }

    const subtotal = () => {
        let total = 0
        cart.forEach(article => { 
            total += (article.snapshot.discount > 0 ? (article.snapshot.price - article.snapshot.price * article.snapshot.discount / 100) : article.snapshot.price) * article.quantity
        })
        return total;
    }

    const subtotalFeesless = () => { // subtotal sin impuestos
        let total = 0
        cart.forEach(article => { 
            total += (article.snapshot.discount > 0 ? (article.snapshot.price - article.snapshot.price * article.snapshot.discount / 100) : article.snapshot.price) * article.quantity
        })
        return total;
    }

    const params = () => {
        console.log(cart)
        return cart.map(item => `${item.quantity}${item.id}`).join('-')
    }

    return {
        isLoading, setIsLoading,
        error, setError,
        add,
        remove,
        clear, // remove all
        count,
        articles: cart,
        subtotal,
        subtotalFeesless,
        params,
        getArticle: (id) => request(setIsLoading, setError, getArticle, Number(id)),
        getArticles: (ids) => 
            request(setIsLoading, setError, getArticles, ids ?? cart.map(article => article.id))
    }

}