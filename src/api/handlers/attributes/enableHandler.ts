import attribute from '@/api/models/Attribute'
import request from '../../controllers/attributes/enableController'
import handleError from '../errorHandler'

export const enable = async(attribute:attribute):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        attribute.disabled = false
        const attributeEnabled = await request(attribute.id)
        resolve(attributeEnabled)

    } catch(err:any) { reject(handleError(err)) }
})

export default enable