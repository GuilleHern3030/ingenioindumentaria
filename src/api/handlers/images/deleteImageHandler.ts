import request from '../../controllers/images/deleteImageController.ts'
import Article from '../../objects/Article.ts'

/**
 * Upload an image to DataBase
 * @param img Image in FormData
 * @param article Article object to which the changes will be applied
 * @returns Promise with JSON object with format { src:string, size:string } 
 */
export const deleteImage = async(img:Record<string, any>, article:Article|undefined):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        // Solicitar la petición al Backend
        const response = await request(img.src)
        
        // Borra la imagen del Article
        if (article !== undefined && Article.isArticle(article))
            article.deleteImage(img)

        // Devuelve la respuesta del Backend
        console.log(response)
        resolve(response)


    } catch(err:any) {
        console.error(err)
        try {
            const message = err.response.data.message
            reject(message)
        } catch (e) { // no message received (server shutdown?)
            const message = err.message
            reject(message)
        }
    }
})

export default deleteImage