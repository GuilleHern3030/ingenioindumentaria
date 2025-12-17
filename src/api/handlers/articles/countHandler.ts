import request from '../../controllers/articles/countController'
import handleError from '../errorHandler.js'

export default async(slug:string, include_children:boolean=false, filters:object=null):Promise<number> => new Promise(async(resolve, reject) => {

    try {

        // Obtener el producto en formato JSON
        const rawCount:number = await request(slug, include_children, filters)

        // Convertir a objeto Producto
        //const product = new Product(rawArticles)

        // Devuelve el producto en formato correcto
        resolve(rawCount)


    } catch(err:any) { reject(handleError(err)) }
})