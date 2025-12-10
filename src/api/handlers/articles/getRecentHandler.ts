import request from '../../controllers/articles/getRecentController'
import handleError from '../errorHandler.js'

export default async(start:number=0, limit:number=20):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener el producto en formato JSON
        const json:any = await request(start, limit)

        // Devuelve el producto en formato correcto
        resolve(json)


    } catch(err:any) { reject(handleError(err)) }
})