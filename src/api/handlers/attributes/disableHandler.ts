import request from '../../controllers/attributes/disableController'
import handleError from '../errorHandler'
import attribute from '@/api/models/Attribute'

export const disable = async(attribute:attribute):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        attribute.disabled = true
        const attributeDisabled = await request(attribute.id)
        resolve(attributeDisabled)

    } catch(err:any) { reject(handleError(err)) }
})

export default disable