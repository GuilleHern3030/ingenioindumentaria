import { lazyLoading, lazyLoadLimit } from '@/api/config.json'

// Data base name
const DATA_BASE = "IngenioIndumentaria"

// Stores
const CATEGORIES = "Categories" // Categorías
const ATTRIBUTES = "Attributes" // Atributos
const ARTICLES = "Articles" // Articulos precargados
const SHOPPING_CART = "Cart" // Artículos en el carrito

// --- Auxiliary functions --- //
const open = async () => new Promise((resolve, reject) => {
    const IDBrequest = window.indexedDB.open(DATA_BASE, 1)
    IDBrequest.onupgradeneeded = () => {
        const db = IDBrequest.result
        db.createObjectStore(ARTICLES, { keyPath: "id" } /*{ autoIncrement: true }*/)
        db.createObjectStore(ATTRIBUTES, { keyPath: "id" })
        db.createObjectStore(CATEGORIES, { keyPath: "slug" })
        db.createObjectStore(SHOPPING_CART, { keyPath: "id" })
    }
    IDBrequest.onerror = e => reject(e)
    IDBrequest.onsuccess = event => {

        IDBrequest["event"] = event
        IDBrequest["close"] = () => event.target.result.close()
        IDBrequest["write"] = (objectStore) => dbWrite(IDBrequest, objectStore)
        IDBrequest["read"] = (objectStore) => dbRead(IDBrequest, objectStore)
        IDBrequest["select"] = (objectStore, func = undefined, order = null, start = 0, limit = 0) => dbSelect(IDBrequest, objectStore, func, order, start, limit)
        IDBrequest["pks"] = (objectStore, func = undefined, order = null) => dbGetPks(IDBrequest, objectStore, func, order)
        IDBrequest["get"] = (objectStore, key = undefined) => key ? dbGet(IDBrequest, objectStore, key) : dbGetAll(IDBrequest, objectStore)
        IDBrequest["set"] = (objectStore, objects) => dbSetAll(IDBrequest, objectStore, objects)
        resolve(IDBrequest)

    }
})

const dbRead = (IDBrequest, objectStore) => {
    const request = IDBrequest.event.target.result
    const transaction = request.transaction(objectStore, "readonly")
    const store = transaction.objectStore(objectStore)
    return { request, transaction, store }
}

const dbWrite = (IDBrequest, objectStore) => {
    const request = IDBrequest.event.target.result
    const transaction = request.transaction(objectStore, "readwrite")
    const store = transaction.objectStore(objectStore)
    return { request, transaction, store }
}

const dbSelect = (IDBrequest, objectStore, filter, order = null, start = 0, limit = 0) => new Promise((resolve, reject) => {
    const { store } = dbRead(IDBrequest, objectStore)

    console.time("idb selection")
    const objects = []
    let n = 0;
    if (order == null) {
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                const filterResult = filter(object)
                if (filterResult == true) {
                    n++
                    if (n >= start)
                        objects.push(object)
                    if (limit > 0 && n >= start + limit)
                        resolve(objects)
                }
                cursor.result.continue()
            } else resolve(objects)
        })
    } else dbGetAll(IDBrequest, objectStore).then(objs => {
        const objectsSorted = sortBy(objs, order.key, order.order)
        objectsSorted.forEach(object => {
            if (!(limit > 0 && n >= start + limit)) {
                const filterResult = filter(object)
                if (filterResult == true) {
                    n++
                    if (n >= start)
                        objects.push(object)
                    if (limit > 0 && n >= start + limit)
                        resolve(objects)
                }
            }
        })
        resolve(objects)
    })
    console.timeEnd("idb selection")
})

const dbGetPks = (IDBrequest, objectStore, filter, order = null) => new Promise((resolve, reject) => {
    const { store } = dbRead(IDBrequest, objectStore)

    console.time("idb count")
    const pks = []
    if (order == null) {
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                const filterResult = filter(object)
                if (filterResult == true)
                    pks.push(object.id ?? object.slug)
                cursor.result.continue()
            } else resolve(pks)
        })
    } else dbGetAll(IDBrequest, objectStore).then(objs => {
        const objectsSorted = sortBy(objs, order.key, order.order)
        objectsSorted.forEach(object => {
            const filterResult = filter(object)
            if (filterResult == true)
                pks.push(object.id ?? object.slug)
        })
        resolve(pks)
    })
    console.timeEnd("idb count")
})

const dbSetAll = (IDBrequest, objectStore, objects) => new Promise((resolve, reject) => {
    if (objects) {
        const { transaction, store } = dbWrite(IDBrequest, objectStore)
        objects.forEach(object => {
            store.add(object)
        })
        transaction.addEventListener("complete", () => resolve())
    } else resolve()
})

const dbGetAll = (IDBrequest, objectStore) => new Promise((resolve, reject) => {
    const { store } = dbRead(IDBrequest, objectStore)
    const objects = []

    const cursor = store.getAll()
    cursor.onsuccess = () => resolve(cursor.result)

})

const dbGet = (IDBrequest, objectStore, key) => new Promise(async(resolve, reject) => {
    const { store } = dbRead(IDBrequest, objectStore)

    if (!Array.isArray(key)) {

        const cursor = store.get(key)
        cursor.onsuccess = () => resolve(cursor.result)

    } else { // key array

        console.time("idb selectByPK")

        const promises = key.map(pk =>
            new Promise(resolve => {
                const req = store.get(pk);
                req.onsuccess = () => resolve(req.result);
            })
        )

        const objects = await Promise.all(promises)
        console.timeEnd("idb selectByPK")
        resolve(objects)

    }
})

const clear = async () => {
    return new Promise(resolve => {
        const IDBrequest = window.indexedDB.deleteDatabase(DATA_BASE)
        IDBrequest.onsuccess = () => resolve()
        IDBrequest.onerror = () => resolve()
    })
}

// --- Getters --- //
const getAttributes = async (slug) => {
    const db = await open()
    db.close()
}

// --- Initialization --- //
export const init = async (categories, attributes, articles = []) => {
    await clear()
    const db = await open()
    await db.set(CATEGORIES, categories)
    await db.set(ATTRIBUTES, attributes)
    await db.set(ARTICLES, articles)
    db.close()
    return;
}

export const pull = async () => {
    const db = await open()

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

export default {

    /**
     * Obtiene la información completa de un producto específico
     * @param {number} id id del producto
     * @returns {Promise<Record<string, any>>} información del producto
     */
    getArticle: async (id) => new Promise(async (resolve, reject) => {
        if (!lazyLoading && id > 0) {
            const db = await open()
            const article = await db.get(ARTICLES, id)
            await db.close()
            if (article) resolve(article)
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
    getArticles: (route, include_children, filters = {}, order = null, page = 1) => new Promise(async (resolve, reject) => {
        if (!lazyLoading) {
            const db = await open()

            const pks = await db.pks(ARTICLES, (article) => {
                if (!route || article.Categories.find(category => hasSlug(category.slug, route, include_children))) {

                    const filtersOk = (!filters || Object.keys(filters).length == 0) ? true :
                        article.ProductVariants?.find(variant => hasFilters(variant.Attributes, filters)) != undefined

                    return (filtersOk)

                } return false
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
     * Obtiene los productos más vendidos o que contienen mayor stock
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getMost: async (order = null, page = 1) => new Promise(async (resolve, reject) => {
            
        if (!lazyLoading) {
            const db = await open()

            const pks = await db.pks(ARTICLES, (article) => article.discount > 0, order)

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
            const db = await open()

            const pks = await db.pks(ARTICLES, (article) => article.isRecent === true, order)

            const start = (page - 1) * lazyLoadLimit

            const articles = await db.get(ARTICLES, pks.slice(start, start + lazyLoadLimit))

            await db.close()
            
            if (articles?.length > 0) 
                resolve({ articles, size: pks.length })
            else reject()
        } else reject()
    })

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
 * Ordena un array de objetos por una propiedad arbitraria
 * @param {Array} arr - El array a ordenar
 * @param {string} key - La clave por la que se quiere ordenar (ej: 'price')
 * @param {'asc'|'desc'} order - Tipo de ordenamiento: ascendente o descendente
 * @returns {Array} - Nuevo array ordenado
 */
function sortBy(arr, key, order = 'asc') {
    const sorted = [...arr];

    sorted.sort((a, b) => {
        let A = key == 'price' && a['discount'] > 0 ? a['price'] - a['price'] * a['discount'] / 100 : a[key];
        let B = key == 'price' && b['discount'] > 0 ? b['price'] - b['price'] * b['discount'] / 100 : b[key];

        // Manejo de undefined/null
        if (A == null) return 1;
        if (B == null) return -1;

        // Si son strings → normalizar
        if (typeof A === 'string') A = A.toLowerCase();
        if (typeof B === 'string') B = B.toLowerCase();

        if (A < B) return order === 'asc' ? -1 : 1;
        if (A > B) return order === 'asc' ? 1 : -1;
        return 0;
    });

    return sorted;
}