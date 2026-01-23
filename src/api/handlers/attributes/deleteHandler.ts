import attribute from '@/api/models/Attribute'
import request from '../../controllers/attributes/deleteController'
import handleError from '../errorHandler'

export const destroy = async(attribute:attribute) => new Promise<number>(async(resolve, reject) => {

    try {

        attribute.disabled = null
        const attributeDeletedId = await request(attribute.id)
        resolve(attributeDeletedId)

    } catch(err:any) { reject(handleError(err)) }
})

export default destroy