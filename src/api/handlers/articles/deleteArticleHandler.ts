import request from '../../controllers/articles/deleteArticleController.ts'
import Article from '../../objects/Article.ts'
import handleError from '../errorHandler.ts'
import { isAdmin } from '../../../api'

export const deleteArticle = async(article:Article):Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdmin() === true) try {

        // Obtener el ID del artículo
        const id = article.id()

        // Solicitar la petición al Backend
        const response = await request(id)

        // Devuelve la respuesta del Backend
        console.log("Deleting", article, "\nResponse:", response)
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
    else reject("La sesión caducó. Vuelve a iniciar sesión para continuar.")
})

export default deleteArticle