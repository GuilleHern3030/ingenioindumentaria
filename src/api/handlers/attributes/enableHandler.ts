import { Attribute } from '@/api/objects/Attribute'
import request from '../../controllers/attributes/enableController'
import handleError from '../errorHandler'

export const enable = async(attribute:Attribute):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        const response = await request(attribute.id())
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default enable