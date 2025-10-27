import request from '../../controllers/articles/putArticlesController.ts'
import Article from '../../objects/Article.ts'
import handleError from '../errorHandler.ts'

export const putArticles = async(articles:Array<Article>):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        // Parsear los Article a JSON
        const jsonArticles = articles.map(article => article.json())

        // Solicitar la petición al Backend
        const response = await request(jsonArticles)

        // Devuelve la respuesta del Backend
        console.log(response)
        return response


    } catch(err:any) { reject(handleError(err)) }
})

export default putArticles