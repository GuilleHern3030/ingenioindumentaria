import selectByCategoryCascade from './selectByCategoryCascadeHandler'
import handleError from '../errorHandler'

export const selectByCategoriesCascade = async(slugs?:string[], includeDisabled?:boolean):Promise<Record<string, any>> => new Promise(async(resolve, reject) => {

    try { // slugs es un array de strings

        if (slugs == undefined)
            resolve(await selectByCategoryCascade(undefined, includeDisabled === true))

        if (Array.isArray(slugs) && slugs.length == 1) {
            resolve(await selectByCategoryCascade(slugs[0], includeDisabled === true))
        }

        // Corrige el formato de la ruta        
        const results = await Promise.all( // Fuerza a que se ejecuten todas las promesas antes de continuar
            slugs.map(async slug => selectByCategoryCascade(slug, includeDisabled === true))
        )

        // Devuelve las atributos en formato correcto
        resolve(results)


    } catch(err:any) { reject(handleError(err)) }
})

export default selectByCategoriesCascade