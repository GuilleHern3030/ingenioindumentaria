import request from '../../controllers/articles/putArticlesController.ts'
import Article from '../../objects/Article.ts'
import handleError from '../errorHandler.ts'
import { isAdmin } from '../../index.ts'

export const putArticles = async(articles:Array<Article>):Promise<any> => new Promise(async(resolve, reject) => {

    if (isAdmin() === true) try {

        // Parsear los Article a JSON
        const jsonArticles = articles.map(article => article.json())

        // Solicitar la petición al Backend
        const response = await request(jsonArticles)

        // Devuelve la respuesta del Backend
        console.log(response)
        return response


    } catch(err:any) { reject(handleError(err)) }
    else reject("La sesión caducó. Vuelve a iniciar sesión para continuar.")
})

export default putArticles