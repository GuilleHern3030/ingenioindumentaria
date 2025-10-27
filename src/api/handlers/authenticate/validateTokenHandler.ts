import request from '../../controllers/authenticate/validateTokenController.ts'
import handleError from '../errorHandler.ts'

/**
 * Checks if the token is valid
 * @param token Token to check
 * @returns 
 */
export const validateToken = async(token:string) => new Promise(async (resolve, reject) => {

    try {

        if (!token || !(typeof(token) === 'string')) 
            reject("No iniciaste sesión o la sesión expiró")
        
        // Solicitar la petición al Backend
        const response = await request(token)

        // Devuelve la respuesta del Backend
        console.log(response)
        resolve(response)

    } catch(err:any) { reject(handleError(err)) }
})

export default validateToken;