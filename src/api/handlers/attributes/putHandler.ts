import request from '../../controllers/attributes/putController'
import handleError from '../errorHandler'

export const putHandler = async(attribute:Record<string, any>, newName:string):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        //attribute.name = newName // establece el nuevo nombre

        const response = await request(attribute, attribute.slugs)
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default putHandler