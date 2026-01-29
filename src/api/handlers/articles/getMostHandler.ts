import request from '../../controllers/articles/getMostController'
import handleError from '../errorHandler.js'
import { lazyLoadLimit } from '../../config.json'

export default async(order:object=null, page:number=1, limit:number=lazyLoadLimit):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        if (!navigator.onLine) throw new Error()

        // Obtener el producto en formato JSON
        const json:any = await request(order, page, limit)

        // Devuelve el producto en formato correcto
        resolve(json)


    } catch(err:any) { reject(handleError(err)) }
})