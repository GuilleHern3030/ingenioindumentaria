import request from '../../controllers/images/deleteImageController'
import Article from '../../objects/Article'
import Product from '../../objects/Product'
import handleError from '../errorHandler'
import { isAdmin } from '../../index'
import { image } from '@/api/objects/Image'

/**
 * Upload an image to DataBase
 * @param {image} img Image in FormData
 * @param {Article|Product|undefined} article Article object to which the changes will be applied
 * @returns Promise with JSON object with format { src:string, size:string } 
 */
export const deleteImage = async(img:image, article?:Article|Product):Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdmin() === true) try {

        // Solicitar la petición al Backend
        const response = await request(img.id ? img.id : img.src)
        
        // Borra la imagen del Article
        if (article !== undefined && Article.isArticle(article) 
        || article !== undefined && Product.isProduct(article))
            article.deleteImage(img)

        // Devuelve la respuesta del Backend
        resolve(response)


    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError("La sesión caducó. Vuelve a iniciar sesión para continuar."))
})

export default deleteImage