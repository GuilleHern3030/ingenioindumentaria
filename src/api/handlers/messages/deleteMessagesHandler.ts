import request from '../../controllers/messages/deleteMessagesController.ts'
import handleError from '../errorHandler.ts'

/**
 * Delete all messages from DataBase
 * @returns Promise with JSON object
 */
export const deleteMessage = async():Promise<any> => new Promise(async(resolve, reject) => {

    try {

        const result = await request()
        resolve(result)

    } catch(err:any) { reject(handleError(err)) }
})

export default deleteMessage