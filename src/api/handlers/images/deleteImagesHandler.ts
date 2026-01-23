import deleteImage from './deleteImageHandler'

/**
 * Deletes an image from DataBase
 * @param img Image in JSON object format { src:string, size:string } 
 * @returns Promise with JSON object with format { src:string, size:string } 
 */
export const deleteImages = async(images:Array<any>):Promise<any[]> => {

    if (images && images.length > 0 && Array.isArray(images)) {

        const results = await Promise.all( // Fuerza a que se ejecuten todas las promesas antes de continuar
            images.map(async image => deleteImage(image))
        )

        // Devuelve las respuestas del Backend
        return results

    } return []
}

export default deleteImages
