import request from '../../controllers/messages/postMessageController.ts'
import { maxMessageSize } from '../../config.json'

/**
 * Upload a message to DataBase
 * @returns Promise with JSON
 */
export const postMessage = async(sender:string, message:string, email:string, phone:string):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        console.log(message.length > Number(maxMessageSize))

        if (message && typeof(message) == 'string') {

            if (message.length < Number(maxMessageSize)) {

                // Solicitar la petición al Backend
                const result = await request({ sender, message, email, phone })
                
                // Devuelve la respuesta del Backend
                console.log("Mensaje enviado:", result)
                resolve(result)

            } else reject(`El mensaje supera el máximo de ${maxMessageSize} caracteres`)

        } else reject("El mensaje no puede estar vacío")

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

export default postMessage