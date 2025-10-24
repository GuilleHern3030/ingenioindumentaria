import request from '../../controllers/articles/putArticleController.ts'
import Article from '../../objects/Article.ts'

export const putArticle = async(article:Article):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        // Parsear el Article a JSON
        const jsonArticle = article.json()

        // Solicitar la petición al Backend
        const response = await request(jsonArticle)

        // Devuelve la respuesta del Backend
        console.log("Putting", article, "\nResponse:", response)
        resolve(response) // true

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

export default putArticle