import request from '../../controllers/images/postImageController'
import { maxImageSize, imagesType } from '../../config.json'
import handleError from '../errorHandler'
import { isAdmin } from '../../index'
import { image } from '@/api/objects/Image'

/**
 * Upload an image to DataBase
 * @param img Image in FormData
 * @returns Promise with JSON object with format { src:string, size:string } 
 */
export const postImage = async(img:image):Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdmin() === true) try {

        if (!img.size || img.size && Number(img.size) < maxImageSize) {

            if (img.formData) {
                for (const pair of img.formData.entries()) {
                    const fileType = pair[1].type.split("/")[1]
                    if (!imagesType.includes(fileType)) {
                        reject("Image format forbidden")
                        return;
                    }
                }
            }

            // Solicitar la petición al Backend
            const newImg = await request(img.formData)

            // Devuelve la respuesta del Backend
            resolve(newImg)

        } else reject(`La imagen supera el límite máximo de ${maxImageSize/1000} KB`)

    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError("La sesión caducó. Vuelve a iniciar sesión para continuar."))
})

export default postImage