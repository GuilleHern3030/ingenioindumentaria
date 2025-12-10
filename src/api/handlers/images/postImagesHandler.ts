import postImage from './postImageHandler'
import { maxImagesSize, maxImageSize } from '../../config.json'
import { size as getImagesSize } from '../../../api/indexedDB.js'
import { image } from '@/api/objects/Image'

/**
 * Upload some images into DataBase
 * @param img Image in JSON object format { src:string, size:string } 
 * @returns Promise with JSON object with format { src:string, size:string } 
 */
export const postImages = async(images:Array<any>, product?:Record<string, any>):Promise<any[]> => {

    if (images && images.length > 0 && Array.isArray(images)) {

        // Obtener el tamaño actual de todas las imágenes
        const actuallySize:number = await getImagesSize()
        console.warn("Tamaño actual:", actuallySize, "de", maxImagesSize)

        // Calcular el tamaño de las imágenes que se quiere subir
        let sizeToPost = 0
        images.forEach(image => {
            if (image.size && !isNaN(Number(image.size)) && Number(image.size) > 0) {
                if (Number(image.size) > maxImageSize) {
                    console.error(image, " is bigger than ", maxImageSize)
                    throw new Error(`Una de las imágenes supera el límite máximo de ${maxImageSize/1000} KB`)
                }
                sizeToPost += image.size
            }
        })
        
        if (!actuallySize || isNaN(Number(actuallySize)) || (Number(actuallySize) + Number(sizeToPost) < maxImagesSize)) {

            // Hacer una petición al backend por cada imagen que se quiere guardar
            if (images.length > 0) {

                const results = await Promise.all( // Fuerza a que se ejecuten todas las promesas antes de continuar
                    images.map(async image => postImage(image, product))
                )

                // Devuelve las respuestas del Backend
                return results
            }

        } else throw new Error(`Se superó el tamaño total de imágenes (${maxImagesSize/1000} KB)`)
    } return []
}

export default postImages
