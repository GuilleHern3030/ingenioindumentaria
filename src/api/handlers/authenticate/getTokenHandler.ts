import requestToken from '../../controllers/authenticate/getTokenController.ts'
import requestGoogleToken from '../../controllers/authenticate/getGoogleTokenController.ts'
import handleError from '../errorHandler.ts'

/**
 * Checks if the token is valid
 * @param user 
 * @returns 
 */
export const getToken = async(user:string, password:string) => new Promise(async(resolve, reject) => {

    try {

        if (!user || typeof(user) !== 'string') 
            reject("Usuario inválido")

        if (!password || typeof(password) !== 'string') 
            reject("Contraseña inválida")

        // Solicitar la petición al Backend
        const token = await requestToken({ user, password })
        
        // Setea el Token y el Usuario en el LocalStorage
        //setLocalToken(token)
        //setLocalUser(user)

        // Devuelve la respuesta del Backend
        console.log(token)
        resolve(token)

    } catch(err:any) { reject(handleError(err)) }
})

/**
 * Checks if the token is valid
 * @param user 
 * @returns 
 */
export const validateGoogleToken = async(oAuth:any) => new Promise(async(resolve, reject) => {

    try {

        if (!oAuth) 
            reject("Token inválido")

        // Solicitar la petición al Backend
        console.log(oAuth)
        const data = await requestGoogleToken({ oAuth })
        
        // Setea el Token y el Usuario en el LocalStorage
        //setLocalToken(token)
        //setLocalUser(user)

        // Devuelve la respuesta del Backend
        console.log(data)
        resolve(data)

    } catch(err:any) { reject(handleError(err)) }
})

export default getToken;