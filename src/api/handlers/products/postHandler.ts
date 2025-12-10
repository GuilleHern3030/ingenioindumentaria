import { Product } from '@/api/objects/Product'
import { image } from '@/api/objects/Image'
import request from '../../controllers/products/postController'
import handleError from '../errorHandler'

export const postHandler = async(product:Product, images?:image[], slugs?:string[], attributes?:any[], variants?:any[]):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        const response = await request(product.toJson(), images, slugs, attributes, variants)
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default postHandler