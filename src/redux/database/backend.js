import { select, get, getRecent, getMost } from '@/api/articles'
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
     * @param {string} slug ruta de la categoría
     * @param {boolean} include_children define si se incluyen los productos de categorías hijas
     * @param {Record<string, any>} filter establece los filtros
     * @param {Record<string, string>} order establece el orden de listado con formato { key, order:'asc','desc' }
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getArticles: async (slug, include_children=false, filters={}, order=null, start=0, limit=lazyLoadLimit) => {
        const data = await select(slug, include_children, filters, order, start, limit)
        console.log(data)
        return data
    },

    /**
     * Obtiene los productos más vendidos o que contienen mayor stock
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getMost: async (order=null, start=0, limit=lazyLoadLimit) => {
        return await getMost(start, limit)
    },

    /**
     * Obtiene los productos establecidos como recientes
     * @returns {Promise<Record<string, any>[]>} listado de productos
     */
    getRecent: async (order=null, start=0, limit=lazyLoadLimit) => {
        return await getRecent(start, limit)
    }

}