import request from '../../controllers/articles/getsController'
import handleError from '../errorHandler.js'

// Obtener varios artículos por ids
export default async(ids:number[]):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener el producto en formato JSON
        const rawArticles:Record<string, any> = await request(ids)

        // Convertir a objeto Producto
        //const product = new Product(rawArticles)

        // Devuelve el producto en formato correcto
        resolve(rawArticles)


    } catch(err:any) { reject(handleError(err)) }
})