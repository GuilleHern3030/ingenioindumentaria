import request from '../../controllers/messages/getMessagesController.ts'

/**
 * Download messages from DataBase
 * @returns Promise with JSON
 */
export const getMessages = async():Promise<any> => new Promise(async(resolve, reject) => {

    try {

        // Solicitar la petición al Backend
        const messages = await request()
        
        // Devuelve la respuesta del Backend
        console.log("Mensajes:", messages)
        resolve(messages)

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

export default getMessages