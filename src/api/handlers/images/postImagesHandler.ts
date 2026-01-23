import postImage from './postImageHandler'

/**
 * Upload some images into DataBase
 * @param img Image in JSON object format { src:string, size:string } 
 * @returns Promise with JSON object with format { src:string, size:string } 
 */
export const postImages = async(images:Array<any>):Promise<any[]> => {

    if (images && images.length > 0 && Array.isArray(images)) {
        

        // Hacer una petición al backend por cada imagen que se quiere guardar
        if (images.length > 0) {

            const results = await Promise.all( // Fuerza a que se ejecuten todas las promesas antes de continuar
                images.map(async image => postImage(image))
            )

            // Devuelve las respuestas del Backend
            return results
        }

    } return []
}

export default postImages
