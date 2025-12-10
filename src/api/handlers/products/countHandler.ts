import request from '../../controllers/products/countController'
import handleError from '../errorHandler'

export const count = async(includeDisabled?:boolean, slug?:string, cascade?:boolean):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try {

        // Corrige el formato de la ruta
        const categorySlug = typeof(slug) === 'string' ? slug : ''

        // Obtener la cantidad de productos
        const products:Number = await request(
            categorySlug.toLowerCase().trim().replace(/\s+/g, '-'),
            includeDisabled === true,
            cascade === true
        )
        
        // Devuelve las categorías en formato correcto
        resolve(products)


    } catch(err:any) { reject(handleError(err)) }
})

export default count