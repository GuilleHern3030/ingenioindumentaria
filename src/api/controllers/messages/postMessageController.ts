import axios from '../axios.ts'
import { getLocalToken, getAdminUser } from '../../../api'

const endpoint = "/messages";

/**
 * Creates a message into DataBase
 * @param {JSON} message Message in JSON format
 * @returns result of the request
 */
export const postMessage = async(message:any) => {

    const { data } = await axios.post(
        endpoint, 
        message, 
        { 
            headers: { 
                token: getLocalToken(), 
                user: getAdminUser() 
            } 
        }
    )

    return data;
}

export default postMessage