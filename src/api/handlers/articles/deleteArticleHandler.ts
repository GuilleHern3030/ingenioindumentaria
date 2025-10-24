import request from '../../controllers/articles/deleteArticleController.ts'
import Article from '../../objects/Article.ts'

export const deleteArticle = async(article:Article):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        // Obtener el ID del artículo
        const id = article.id()

        // Solicitar la petición al Backend
        const response = await request(id)

        // Devuelve la respuesta del Backend
        console.log("Deleting", article, "\nResponse:", response)
        resolve(response)


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

export default deleteArticle