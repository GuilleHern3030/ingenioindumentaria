import request from '../../controllers/products/enableController'
import handleError from '../errorHandler'

export const enable = async(id:number):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        const response = await request(id)
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default enable