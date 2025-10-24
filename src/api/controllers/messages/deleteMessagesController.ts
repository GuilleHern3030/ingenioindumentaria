import axios from '../axios.ts'
import { getLocalToken, getLocalUser } from '../../localtoken.ts'

const endpoint = "/messages";

/**
 * Deletes all messages from DataBase
 * @returns result of the request
 */
export const deleteMessages = async() => {

    const { data } = await axios.delete(
        endpoint, 
        { 
            headers: { 
                token: getLocalToken(), 
                user: getLocalUser() 
            } 
        }
    )
    
    return data;
}

export default deleteMessages