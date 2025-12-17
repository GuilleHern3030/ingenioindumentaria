import { useState, useContext, useEffect } from "react"

// Context
import { DataBaseContext } from '@/context/DataBaseContext'

// Api
import { request } from '@/api'

// Redux
import { useSelector } from "react-redux"
import { getAttributes, getCategories } from "@/redux/reducers/categories/categoriesSelector"

// DataLoaders
import indexedDB from "@/redux/database/indexedDB"
import backend from "@/redux/database/backend"

const getArticles = async (slug, include_parents, filter, order, page) => {
    return indexedDB.getArticles(slug, include_parents, filter, order, page)
        .catch(() => backend.getArticles(slug, include_parents, filter, order, page))
        .catch(() => [])
}

const getMost = async (order, page) => {
    return indexedDB.getMost(order, page)
        .catch(() => backend.getMost(order, page))
        .catch(() => [])
}

const getRecent = async (order, page) => {
    return indexedDB.getRecent(order, page)
        .catch(() => backend.getRecent(order, page))
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

    const getAttributes = (slug) => {
        try {
            const category = categories.find(category => category.slug == slug)
            return attributes.filter(attribute => category.attributes.includes(attribute.id))
        } catch(e) { return [] }
    }

    const getCategories = () => {
        const tree = {}
        try {
            categories.forEach(category => {
                const cleanSlug = category.slug.trim()
                const parts = cleanSlug.split("/")
                let current = tree;
                for (const part of parts) {
                    if (!current[part])
                        current[part] = {}
                    current = current[part];
                }
            })
            console.log(tree)
        } catch(e) { }
        return tree
    }

    const subcategories = (route) => {
        try {
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
        
        } catch(e) { return [] }
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
        getMost: (order = null, page = 1) => request(setIsLoading, setError, getMost, order, page),
        getRecent: (order = null, page = 1) => request(setIsLoading, setError, getRecent, order, page),
        getArticles: (slug, include_children, filter = {}, order = null, page = 0) =>
            request(setIsLoading, setError, getArticles, slug, include_children, filter, order, page),
    }

}