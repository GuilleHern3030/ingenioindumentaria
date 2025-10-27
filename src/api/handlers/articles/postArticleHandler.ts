import request from '../../controllers/articles/postArticleController.ts'
import Article from '../../objects/Article.ts'
import handleError from '../errorHandler.ts'

export const postArticle = async(article:Article):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        // Parsear el Article a JSON
        const jsonArticle = article.json()

        // Solicitar la petición al Backend
        const response = await request(jsonArticle)

        // Devuelve la respuesta del Backend
        console.log("Creating", article, "\nResponse:", response)
        resolve(response) // true


    } catch(err:any) { reject(handleError(err)) }
})

export default postArticle