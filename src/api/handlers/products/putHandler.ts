import { Product } from '@/api/objects/Product'
import request from '../../controllers/products/putController'
import handleError from '../errorHandler'
import { image } from '@/api/objects/Image'

export const putHandler = async(product:Product, images?:image[], slugs?:string[], attributes?:any[], variants?:any[]):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        const response = await request(product.toJson(), images, slugs, attributes, variants)
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default putHandler