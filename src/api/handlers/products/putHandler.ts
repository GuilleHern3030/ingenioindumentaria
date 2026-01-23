import request from '../../controllers/products/putController'
import handleError from '../errorHandler'

import { image } from '@/api/models/Image'
import { product } from '@/api/models/Product'

export const putHandler = async(product:product, images?:image[], slugs?:string[], variants?:any[]):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        const response = await request(product, images, slugs, variants)
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default putHandler