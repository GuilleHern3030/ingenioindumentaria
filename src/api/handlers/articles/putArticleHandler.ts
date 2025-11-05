import request from '../../controllers/articles/putArticleController.ts'
import Article from '../../objects/Article.ts'
import handleError from '../errorHandler.ts'
import { isAdmin } from '../../index.ts'

export const putArticle = async(article:Article):Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdmin() === true) try {

        // Parsear el Article a JSON
        const jsonArticle = article.json()

        // Solicitar la petición al Backend
        const response = await request(jsonArticle)

        // Devuelve la respuesta del Backend
        console.log("Putting", article, "\nResponse:", response)
        resolve(response) // true

    } catch(err:any) { reject(handleError(err)) }
    else reject("La sesión caducó. Vuelve a iniciar sesión para continuar.")

})

export default putArticle