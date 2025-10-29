import axios from '../axios.ts'
import { getLocalToken, getAdminUser } from '../../../api'

const endpoint = "/messages";

/**
 * Deletes a message from DataBase
 * @param {number} id Message id
 * @returns result of the request
 */
export const deleteMessage = async(id:number) => {

    const { data } = await axios.delete(
        endpoint + "/" + id, 
        { 
            headers: { 
                token: getLocalToken(), 
                user: getAdminUser() 
            } 
        }
    )
    
    return data;
}

export default deleteMessage