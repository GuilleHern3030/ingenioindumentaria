import request from '../../controllers/products/deleteController'
import handleError from '../errorHandler'
import Product from '@/api/objects/Product'

export const destroy = async(product:Product):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        const response = await request(product.id())
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default destroy