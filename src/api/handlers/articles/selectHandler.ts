import request from '../../controllers/articles/selectController.js'
import handleError from '../errorHandler.js'
import { lazyLoadLimit } from '../../config.json'

export default async(slug:string, include_children:boolean=false, filters:object=null, order:object=null, page:number=1, limit:number=lazyLoadLimit):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Obtener el producto en formato JSON
        const rawArticles:Record<string, any> = await request(slug, include_children, filters, order, page, limit)

        // Devuelve el producto en formato correcto
        resolve(rawArticles)


    } catch(err:any) { reject(handleError(err)) }
})