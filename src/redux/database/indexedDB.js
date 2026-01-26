import { lazyLoading, lazyLoadLimit } from '@/api/config.json'
import { open, remove } from '@/api/indexedDB'
import IdUtils from '@/utils/IdUtils'

// Data bases names
const DATA_BASE_CATALOG = "IngenioIndumentaria-catalog" // CATEGORIES, ATTRIBUTES, ARTICLES
const DATA_BASE_CART = "IngenioIndumentaria-cart" // SHOPPING_CART

// Stores
const CATEGORIES = "Categories" // Categorías
const ATTRIBUTES = "Attributes" // Atributos
const ARTICLES = "Articles" // Articulos precargados
const SHOPPING_CART = "Cart" // Artículos en el carrito

// Index
const ARTICLES_NAME_INDEX = { key: "name_idx", value: "name" }

// --- Initialization --- //
export const init = async (categories, attributes, articles = [], storedCart) => {

    // CATALOG
    await remove(DATA_BASE_CATALOG) // Remueve la base de datos
    const catalog = await open(DATA_BASE_CATALOG, database => {
        database.createObjectStore(ATTRIBUTES, { keyPath: "id" })
        database.createObjectStore(CATEGORIES, { keyPath: "slug" })
        const articleStore = database.createObjectStore(ARTICLES, { keyPath: "id" } /*{ autoIncrement: true }*/)
        articleStore.createIndex(ARTICLES_NAME_INDEX.key, ARTICLES_NAME_INDEX.value, { unique: false })
    })
    await catalog.set(CATEGORIES, categories)
    await catalog.set(ATTRIBUTES, attributes)
    await catalog.set(ARTICLES, articles)
    catalog.close()

    // SHOPPING CART
    if (storedCart) await remove(DATA_BASE_CART)
    const cart = await open(DATA_BASE_CART, database => {
        database.createObjectStore(SHOPPING_CART, { keyPath: "id" })
    })
    if (storedCart) await cart.set(SHOPPING_CART, storedCart)
    cart.close()

    return;
}

export const pull = async () => {
    const db = await open(DATA_BASE_CATALOG)

    const categories = await db.get(CATEGORIES)
    const attributes = await db.get(ATTRIBUTES)
    const articles = await db.get(ARTICLES)

    db.close()

    return {
        articles,
        attributes,
        categories
    }
}

export const getCart = async () => new Promise(async (resolve, reject) => {
    const db = await open(DATA_BASE_CART)
    const articles = await db.get(SHOPPING_CART)
    await db.close()
    resolve(articles)
})

export default {

    /**
     * Obtiene la información completa de un producto específico
     * @param {number} id id del producto
     * @returns {Promise<Record<string, any>>} información del producto
     */
    getArticle: async (id) => new Promise(async (resolve, reject) => {
        if (!lazyLoading && id > 0) {
            const db = await open(DATA_BASE_CATALOG)
            const article = await db.get(ARTICLES, id)
            formatArticle(article)
            await db.close()
            if (article) resolve(article)
            else reject()
        } else reject()
    }),

    /**
     * Obtiene productos específicos según ID
     * @param {(number|string)[]} ids Pueden estar mezclados ids numericos y alfanuméricos
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getArticles: (ids) => new Promise(async (resolve, reject) => {
        if (!lazyLoading) {

            const db = await open(DATA_BASE_CATALOG)

            const pks = ids.map(id => {
                if (typeof (id) != 'string') return { id };
                else return IdUtils.parse(id)
            })

            const articles = await db.get(ARTICLES, pks.map(pk => pk.id))

            await db.close()

            articles.forEach((article, index) => {
                formatArticle(article)
                if (pks[index].variantId) {
                    const variant = article.variants.find(variant => variant.id == pks[index].variantId)
                    article.variant = variant
                }
                try { delete article.variants } catch (e) { } // Borrar los datos de las variantes sobrantes
            })

            if (articles?.length > 0)
                resolve(articles)
            else reject()
        } else reject()
    }),

    /**
     * Obtiene los productos más vendidos o que contienen mayor stock
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getMost: async (order = null, page = 1) => new Promise(async (resolve, reject) => {

        if (!lazyLoading) {
            const db = await open(DATA_BASE_CATALOG)

            const pks = await db.pks(ARTICLES, (article) => {
                formatArticle(article)
                return article.discount > 0
            }, order)

            const start = (page - 1) * lazyLoadLimit

            const articles = await db.get(ARTICLES, pks.slice(start, start + lazyLoadLimit))

            await db.close()

            if (articles?.length > 0)
                resolve({ articles, size: pks.length })
            else reject()
        } else reject()
    }),

    /**
     * Obtiene los productos establecidos como recientes
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getRecent: async (order = null, page = 1) => new Promise(async (resolve, reject) => {
        if (!lazyLoading) {
            const db = await open(DATA_BASE_CATALOG)

            const pks = await db.pks(ARTICLES, (article) => {
                formatArticle(article)
                return article.newest === true
            }, order)

            const start = (page - 1) * lazyLoadLimit

            const articles = await db.get(ARTICLES, pks.slice(start, start + lazyLoadLimit))

            await db.close()

            if (articles?.length > 0)
                resolve({ articles, size: pks.length })
            else reject()
        } else reject()
    }),

    /**
     * Obtiene los productos de una categoría específica
     * @param {string} route ruta de la categoría
     * @param {boolean} include_children define si se incluyen los productos de categorías padre
     * @param {Record<number, number>} filters establece los filtros. Su formato es { attributeId, valueId }.
     * @param {Record<string, string>} order establece el orden de listado con formato { key, order:'asc','desc' }
     * @param {number} start establece desde qué número de id que será devuelto
     * @param {Array<number>} pks ids donde se realizará la búsqueda (null para revisar todos)
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    selectArticles: (route, include_children, filters = {}, order = null, page = 1) => new Promise(async (resolve, reject) => {
        if (!lazyLoading) {
            const db = await open(DATA_BASE_CATALOG)

            const pks = await db.pks(ARTICLES, (article) => {
                formatArticle(article)
                if (!route || article.categories.find(category => hasSlug(category.slug, route, include_children))) {

                    const filtersOk = (!filters || Object.keys(filters).length == 0) ? true :
                        article.variants?.find(variant => hasFilters(variant.attributes, filters)) != undefined

                    return (filtersOk)

                } return false
            }, order)

            const start = (page - 1) * lazyLoadLimit

            const articles = await db.get(ARTICLES, pks.slice(start, start + lazyLoadLimit))

            await db.close()

            if (pks?.length > 0)
                resolve({ articles, size: pks.length })
            else reject()
        } else reject()
    }),

    /**
     * Busca artículos en la base de datos indexada
     * @param {string} prompt Caracteres con los que buscar
     * @param {Record<number, number>} filters establece los filtros. Su formato es { attributeId, valueId }.
     * @param {Record<string, string>} order establece el orden de listado con formato { key, order:'asc','desc' }
     * @returns {Promise<Record<string, any>[]>} listado de artículos encontrados
     */
    searchArticles: async (prompt, filters = {}, order = null, page = 1) => new Promise(async (resolve, reject) => {
        //if (!lazyLoading) {
            const prompts = [
                prompt,
                prompt[0].toLowerCase(),
                prompt[0].toUpperCase(),
            ]
            const db = await open(DATA_BASE_CATALOG)
            const start = (page - 1) * lazyLoadLimit
            const filter = (article) => {
                formatArticle(article)
                return (!filters || Object.keys(filters).length == 0) ? true :
                article.variants?.find(variant => hasFilters(variant.attributes, filters)) != undefined
            }
            
            const results = await db.search(ARTICLES, ARTICLES_NAME_INDEX, prompts, filter, order, start, lazyLoadLimit)
            
            await db.close()
            resolve({ articles: results.objects, size: results.size })
        //} else reject()
    }),

    cart: {

        get: getCart,

        add: async (article) => new Promise(async (resolve, reject) => {
            //if (!lazyLoading) {
            const db = await open(DATA_BASE_CART)
            const prev = await db.select(SHOPPING_CART, object => object.id == article.id)
            if (prev?.objects.length > 0) { // ya tiene un artículo idéntico
                article.quantity += prev.objects[0].quantity;
                db.edit(SHOPPING_CART, article.id, article)
            } else await db.add(SHOPPING_CART, article)
            const newCart = await db.get(SHOPPING_CART)
            await db.close()
            resolve(newCart)
            //} else reject()
        }),

        remove: async (article) => new Promise(async (resolve, reject) => {
            //if (!lazyLoading) {
            const db = await open(DATA_BASE_CART)
            await db.remove(SHOPPING_CART, article.id)
            const newCart = await db.get(SHOPPING_CART)
            await db.close()
            resolve(newCart)
            //} else reject()
        }),

        clear: async (article) => new Promise(async (resolve, reject) => {
            //if (!lazyLoading) {
            const db = await open(DATA_BASE_CART)
            await db.clear(SHOPPING_CART)
            await db.close()
            resolve()
            //} else reject()
        }),

    }

}

// --- AUXILIARY FUNCTIONS --- //

const hasSlug = (slug, route, include_children) => {
    if (slug == route) return true
    else if (include_children)
        return slug.startsWith(route)
}

/**
 * Verifica que el filtro exista
 * @param {Record<string, string|number>[]} attributes Attributos contienen { attributeId, valueId }
 * @param {Record<number, number>} filters Filtros en formato { attributeId: valueId }
 * @returns {boolean} Si el filtro existe, devuelve true
 */
const hasAnyFilter = (attributes, filters) => {
    return Object.entries(filters).find(([attributeId, valueId]) =>
        attributes.find(attribute =>
            attributeId == attribute.attributeId &&
            valueId == attribute.valueId
        ) != undefined
    ) != undefined
}

/**
 * Verifica que cumpla todos los filtros
 * @param {Record<string, string|number>[]} attributes Attributos contienen { attributeId, valueId }
 * @param {Record<number, number>} filters Filtros en formato { attributeId: valueId }
 * @returns {boolean} Si el filtro existe, devuelve true
 */
const hasFilters = (attributes, filters) => {
    const attributesArray = Object.entries(filters)
    return attributesArray.filter(([attributeId, valueId]) =>
        attributes.find(attribute =>
            attributeId == attribute.attributeId &&
            valueId == attribute.valueId
        ) != undefined
    ).length == attributesArray.length
}

/**
 * Establece los valores mínimos de un Article
 * @param {Record<string, any>} article Article
 */
const formatArticle = (article) => {

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