import request from '../../controllers/articles/getController'
import handleError from '../errorHandler.js'

import product from '@/api/models/Product'

export default async(id:number) => new Promise<product>(async(resolve, reject) => {

    try {

        if (!navigator.onLine) throw new Error()

        if (id > 0) {

            // Obtener el producto en formato JSON
            const product:product = await request(id)

            // Devuelve el producto en formato correcto
            resolve(product)

        } else throw new Error("Invalid ID")

    } catch(err:any) { reject(handleError(err)) }
})