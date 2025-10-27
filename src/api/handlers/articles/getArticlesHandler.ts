import request from '../../controllers/articles/getArticlesController.ts'
import Article from '../../objects/Article.ts'
import { hasUniqueValues } from '../../models/Article.ts'
import handleError from '../errorHandler.ts'

export const getArticles = async():Promise<Article[]> => new Promise(async(resolve, reject) => {

    try {

        // Obtener los artículos en formato JSON
        const jsonArray:Array<any> = await request()

        // Verificar que los valores definidos como únicos son realmente únicos
        hasUniqueValues(jsonArray) // throws en caso de fallar
 
        // Parsear los artículos de JSON a Article
        const articlesArray = jsonArray.map(json => new Article(json))

        // Devuelve los artículos en formato correcto
        resolve(articlesArray)


    } catch(err:any) { reject(handleError(err)) }
})

export default getArticles