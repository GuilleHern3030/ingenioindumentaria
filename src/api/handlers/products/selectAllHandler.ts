import request from '../../controllers/products/selectAllController'
import handleError from '../errorHandler'

import product from '@/api/models/Product'
import category from '@/api/models/Category'

interface Response {
  categorized: category[] 
  uncategorized: number[]
}

export const selectAll = async() => new Promise<Record<string, any>>(async(resolve, reject) => {

    try {

        // Obtener los productos en formato JSON
        const response:Response = await request()

        // Convertir a objeto Producto
        const categoriesTree = parseCategories(response.categorized)

        // Devuelve los productos en formato correcto
        resolve({ 
            products: response,
            categories: categoriesTree
        })

    } catch(err:any) { reject(handleError(err)) }
})

const parseCategories = (categories:category[]) => {
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
    } catch (e) { }
    return tree
}

export default selectAll