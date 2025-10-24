import request from '../../controllers/messages/deleteMessageController.ts'

/**
 * Delete a message from DataBase
 * @returns Promise with JSON object
 */
export const deleteMessage = async(id:number):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        if (id != undefined && id >= 0) {

            const result = await request(id)
            resolve(result)

        } else reject("El mensaje no existe")

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