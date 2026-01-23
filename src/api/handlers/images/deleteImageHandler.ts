import request from '../../controllers/images/deleteImageController'
import handleError from '../errorHandler'
import { isAdmin } from '../../index'
import image from '@/api/models/Image'

/**
 * Upload an image to DataBase
 * @param {image} img Image in FormData
 * @returns Promise with JSON object with format { src:string, size:string } 
 */
export const deleteImage = async(img:image):Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdmin() === true) try {

        // Solicitar la petición al Backend
        const response = await request(img.id ? img.id : img.src)

        // Devuelve la respuesta del Backend
        resolve(response)


    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError("Forbidden"))
})

export default deleteImage