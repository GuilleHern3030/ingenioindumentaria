import Product from '@/api/objects/Product'
import request from '../../controllers/products/disableController'
import handleError from '../errorHandler'

export const disable = async(product:Product):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        const response = await request(product.id())
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default disable