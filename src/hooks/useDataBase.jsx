import { useState, useContext, useEffect } from "react"

// Context
import { DataBaseContext } from '@/context/DataBaseContext'
import { lazyLoadLimit } from '@/api/config.json'

// Api
import { request } from '@/api'

// Redux
import { useSelector } from "react-redux"
import { getAttributes, getCategories } from "@/redux/reducers/categories/categoriesSelector"

// DataLoaders
import indexedDB from "@/redux/database/indexedDB"
import backend from "@/redux/database/backend"

const getArticles = async (slug, include_parents, filter, order, start, limit) => {
    return indexedDB.getArticles(slug, include_parents, filter, order, start, limit)
        .catch(() => backend.getArticles(slug, include_parents, filter, order, start, limit))
        .catch(() => [])
}

const getMost = async (order, start, limit) => {
    return indexedDB.getMost(order, start, limit)
        .catch(() => backend.getMost(order, start, limit))
        .catch(() => [])
}

const getRecent = async (order, start, limit) => {
    return indexedDB.getRecent(order, start, limit)
        .catch(() => backend.getRecent(order, start, limit))
        .catch(() => [])
}

const getArticle = async (id) => {
    return indexedDB.getArticle(id)
        .catch(() => backend.getArticle(id))
}

export default function useDataBase() {

    const { isInitializing, init, categories, attributes, hasPromos, hasNewest, articles } = useContext(DataBaseContext)

    const [ isLoading, setIsLoading ] = useState(false)

    const [ error, setError ] = useState()

    //const attributes = useSelector(getAttributes(slug))
    const getAttributes = (slug) => {

        console.time("getAttributes")

        const selectAttributes = slug => {
            const attributesId = []
            slug.split('/').forEach((name, deep) => {
                try {
                    const route = (slug.split('/').slice(0, (deep + 1))).join('/')
                    const attributes = categories[route]
                    attributesId.push(...attributes)
                } catch (e) { }
            })

            const attributesArray = []
            attributesId.forEach(id => {
                if (attributes[id].values?.length > 0)
                    attributesArray.push({ id, ...attributes[id] })
            })

            return attributesArray
        }

        let attributesArray = []
        if (typeof (slug) === 'string')
            attributesArray.push(...selectAttributes(slug))
        else try {
            slug.forEach(s => { attributesArray.push(...selectAttributes(s)) })
            attributesArray = Array.from(new Map(attributes.map(item => [item.id, item])).values())
        } catch(e) { }

        console.timeEnd("getAttributes")
        return attributesArray
    }

    const getCategories = () => {
        const tree = {}
        for (const slug in categories) {
            const cleanSlug = slug.trim()
            const parts = cleanSlug.split("/")
            let current = tree;
            for (const part of parts) {
                if (!current[part])
                    current[part] = {}
                current = current[part];
            }
        }
        return tree
    }

    const subcategories = (route) => {
        const getSubCategories = (slug, categories) => {
            if (slug?.length > 0) {
                const subcategories = categories[slug.shift()]
                return getSubCategories(slug, subcategories)
            } else {
                const subcategories = []
                const prevRoute = route.length > 0 ? route + '/' : ''
                for (const category in categories)
                    subcategories.push(prevRoute + category)
                return subcategories
            }
        }

        return getSubCategories(route?.length > 0 ? route.split('/') : null, getCategories())


    }

    return {
        reload: init,
        isInitializing,
        isLoading, setIsLoading,
        error, setError,
        hasPromos,
        hasNewest,
        categories: getCategories,
        subcategories,
        getAttributes,
        preloadedArticles: articles,
        getArticle: (id) => request(setIsLoading, setError, getArticle, Number(id)),
        getMost: (order = null, start = 0, limit = lazyLoadLimit) => request(setIsLoading, setError, getMost, order, start, limit),
        getRecent: (order = null, start = 0, limit = lazyLoadLimit) => request(setIsLoading, setError, getRecent, order, start, limit),
        getArticles: (slug, include_children, filter = {}, order = null, start = 0, limit = lazyLoadLimit) =>
            request(setIsLoading, setError, getArticles, slug, include_children, filter, order, start, limit),
    }

}