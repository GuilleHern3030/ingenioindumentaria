import request from '../../controllers/messages/deleteMessageController.ts'
import handleError from '../errorHandler.ts'

/**
 * Delete a message from DataBase
 * @returns Promise with JSON object
 */
export const deleteMessage = async(id:number):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        if (id != undefined && !isNaN(id) && id >= 0) {

            const result = await request(id)
            resolve(result)

        } else reject("El mensaje no existe")

    } catch(err:any) { reject(handleError(err)) }
})

export default deleteMessage