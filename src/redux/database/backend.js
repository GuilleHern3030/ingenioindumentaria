import { select, count, get, getRecent, getMost } from '@/api/articles'
import { lazyLoadLimit } from '@/api/config.json'

export default {

    /**
     * Obtiene la información completa de un producto específico
     * @param {number} id id del producto
     * @returns {Promise<Record<string, any>>} información del producto
     */
    getArticle: async (id) => {
        return await get(id)
    },

    /**
     * Obtiene los productos de una categoría específica
     * @param {string} route ruta de la categoría
     * @param {boolean} include_children define si se incluyen los productos de categorías hijas
     * @param {Record<string, any>} filter establece los filtros
     * @param {Record<string, string>} order establece el orden de listado con formato { key, order:'asc','desc' }
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getArticles: async (route, include_children=false, filters={}, order=null, page=1) => {
        const data = await select(route, include_children, filters, order, page, lazyLoadLimit)
        //console.log("GET_ARTICLES_BACKEND", data)
        return data
    },

    /**
     * Obtiene los productos más vendidos o que contienen mayor stock
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getMost: async (order=null, page=1) => {
        return await getMost(order, page, lazyLoadLimit)
    },

    /**
     * Obtiene los productos establecidos como recientes
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getRecent: async (order=null, page=1) => {
        return await getRecent(order, page, lazyLoadLimit)
    }

}