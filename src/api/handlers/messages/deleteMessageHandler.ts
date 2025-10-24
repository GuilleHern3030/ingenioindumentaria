import request from '../../controllers/messages/deleteMessagesController.ts'

/**
 * Delete all messages from DataBase
 * @returns Promise with JSON object
 */
export const deleteMessage = async():Promise<any> => new Promise(async(resolve, reject) => {

    try {

            const result = await request()
            resolve(result)

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

export default deleteMessage