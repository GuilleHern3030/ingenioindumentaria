import request from '../../controllers/authenticate/getTokenController.ts'
import { setLocalToken, setLocalUser } from '../../localtoken.ts'

/**
 * Checks if the token is valid
 * @param token Token to check
 * @returns 
 */
export const getToken = async(user:string, password:string) => new Promise(async(resolve, reject) => {

    try {

        if (!user || !password || !(typeof(user) === 'string' && typeof(password) === 'string')) 
            reject("Usuario y/o Contraseña inválidos")

        // Solicitar la petición al Backend
        const token = await request({ user, password })
        
        // Setea el Token y el Usuario en el LocalStorage
        setLocalToken(token)
        setLocalUser(user)

        // Devuelve la respuesta del Backend
        console.log(token)
        resolve(token)

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

export default getToken;