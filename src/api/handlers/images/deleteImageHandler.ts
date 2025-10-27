import request from '../../controllers/images/deleteImageController.ts'
import Article from '../../objects/Article.ts'
import handleError from '../errorHandler.ts'

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


    } catch(err:any) { reject(handleError(err)) }
})

export default deleteImage