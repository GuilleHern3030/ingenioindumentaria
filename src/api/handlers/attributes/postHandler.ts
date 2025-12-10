import request from '../../controllers/attributes/postController'
import handleError from '../errorHandler'

export const postHandler = async(attribute:Record<string, any>, slugs?:string[]):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        const response = await request(attribute, slugs)
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default postHandler