import request from '../../controllers/products/postController'
import handleError from '../errorHandler'

import { product } from '@/api/models/Product'
import { image } from '@/api/models/Image'

export const postHandler = async(product:product, images?:image[], slugs?:string[], variants?:any[]) => new Promise<product>(async(resolve, reject) => {

    try {

        const response = await request(product, images, slugs, variants)
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default postHandler