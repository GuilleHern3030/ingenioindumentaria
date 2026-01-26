import { useState, useContext, useEffect } from "react"

// Context
import { DataBaseContext } from '@/context/DataBaseContext'

// Api
import { request } from '@/api'

/*// Redux
import { useSelector } from "react-redux"
import { getAttributes, getCategories } from "@/redux/reducers/categories/categoriesSelector"
*/
// DataLoaders
import indexedDB from "@/redux/database/indexedDB"
import backend from "@/redux/database/backend"

const getArticles = async (slug, include_parents, filter, order, page) => {
    return indexedDB.selectArticles(slug, include_parents, filter, order, page)
        .catch(() => backend.selectArticles(slug, include_parents, filter, order, page))
        .catch(() => ({ articles: [], size: 0 }))
        .then(({ articles, size }) => ({ articles: formatArticle(articles), size }))
}

const getMost = async (order, page) => {
    return indexedDB.getMost(order, page)
        .catch(() => backend.getMost(order, page))
        .catch(() => ({ articles: [], size: 0 }))
        .then(({ articles, size }) => ({ articles: formatArticle(articles), size }))
}

const getRecent = async (order, page) => {
    return indexedDB.getRecent(order, page)
        .catch(() => backend.getRecent(order, page))
        .catch(() => ({ articles: [], size: 0 }))
        .then(({ articles, size }) => ({ articles: formatArticle(articles), size }))
}

const getArticle = async (id) => {
    return indexedDB.getArticle(id)
        .catch(() => backend.getArticle(id))
        //.then(article => formatArticle(article))
}

const searchArticles = async (prompt, filter, order, page) => {
    return indexedDB.searchArticles(prompt, filter, order, page)
        .catch(() => backend.searchArticles(prompt, filter, order, page))
        .then(({ articles, size }) => ({ articles: formatArticle(articles), size }))
}

export default function useDataBase() {

    const { isInitializing, init, categories, attributes, hasPromos, hasNewest, articles } = useContext(DataBaseContext)

    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState()

    const getAttributes = (slug) => {
        try {
            const category = categories.find(category => category.slug == slug)
            return attributes.filter(attribute => category.attributes.includes(attribute.id))
        } catch (e) { return [] }
    }

    const getCategories = () => {
        const tree = {}
        try {
            console.log(categories)
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
        } catch (e) { }
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

        } catch (e) { return [] }
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
        getMost: (page = 1, order = null) => request(setIsLoading, setError, getMost, order, page),
        getRecent: (page = 1, order = null) => request(setIsLoading, setError, getRecent, order, page),
        searchArticles: (page = 1, order = null, filter = {}, prompt) =>
            request(setIsLoading, setError, searchArticles, prompt, filter, order, page),
        getArticles: (page = 1, order = null, filter = {}, slug = '', include_children = true) =>
            request(setIsLoading, setError, getArticles, slug, include_children, filter, order, page)
    }

}

const formatArticle = (article) => {
    //console.log(article)

    if (Array.isArray(article))
        return article.map(object => formatArticle(object))

    const sum = (arr) => {
        try {
            if (arr.includes(null)) return null;
            const result = arr.reduce((acc, n) => acc + n, 0);
            return isNaN(result) ? null : result
        } catch(e) { return null }
    }

    const min = (arr) => {
        try {
            const result = Math.min(...arr)
            return (isNaN(result) || !isFinite(result)) ? null : result
        } catch(e) { return null }
    }

    article.price = min(article.variants?.map(variant => variant.price))
    article.stock = sum(article.variants?.map(variant => variant.stock))
    article.variants.forEach(variant => variant.name = variant.name ?? article.name )

    return article
}