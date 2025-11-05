import authenticateRequest from '../../controllers/users/authenticateController.ts'
import googleAuthenticateRequest from '../../controllers/users/authenticateGoogleController.ts'
import handleError from '../errorHandler.ts'

/**
 * Authenticate user by email and password manually
 * @param username Email
 * @param password Password
 * @returns 
 */
export const authenticate = async(username:string, password:string):Promise<Record<string,any>> => new Promise(async (resolve, reject) => {

    try {

        if (username && typeof(username) === 'string') {
            if (password && typeof(password) === 'string') {

                const response = await authenticateRequest(username, password)
                console.log(response)
                resolve(response)

            } else reject(handleError("Contraseña inválida"))
        } else reject(handleError("Usuario inválido"))

    } catch(err:any) { reject(handleError(err)) }
})

/**
 * Authenticate user by email and password manually
 * @param credential Google credential
 * @returns 
 */
export const googleAuthenticate = async(credential:string):Promise<Record<string,any>> => new Promise(async (resolve, reject) => {

    try {

        if (credential && typeof(credential) === 'string') {

                const response = await googleAuthenticateRequest(credential)
                console.log(response)
                resolve(response)

        } else reject("Credencial inválida")

    } catch(err:any) { reject(handleError(err)) }
})

export default (data:Record<string, string>):Promise<Record<string,any>> => {
    if (!data) return new Promise((_, reject) => { reject("No data") })

    // Google
    if (data.google) 
        return googleAuthenticate(data.google)

    // Manual
    return authenticate(data.username, data.password)
}