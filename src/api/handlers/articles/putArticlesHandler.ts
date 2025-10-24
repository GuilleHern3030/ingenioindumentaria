import request from '../../controllers/articles/putArticlesController.ts'
import Article from '../../objects/Article.ts'

export const putArticles = async(articles:Array<Article>):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        // Parsear los Article a JSON
        const jsonArticles = articles.map(article => article.json())

        // Solicitar la petición al Backend
        const response = await request(jsonArticles)

        // Devuelve la respuesta del Backend
        console.log(response)
        return response


    } catch(err:any) {
        console.error(err)
        try {
            const message = err.response.data.message ? err.response.data.message : err.message
            reject(message)
        } catch (e) { // no message received (server shutdown?)
            const message = err.message
            reject(message)
        }
    }
})

export default putArticles