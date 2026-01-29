import request from '../../controllers/articles/pullController.js'
import handleError from '../errorHandler.js'

export default async():Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        if (!navigator.onLine) throw new Error()

        // Obtener el producto en formato JSON
        const data:Record<string, any> = await request()

        // Devuelve el producto en formato correcto
        resolve(data)

    } catch(err:any) { reject(handleError(err)) }
})