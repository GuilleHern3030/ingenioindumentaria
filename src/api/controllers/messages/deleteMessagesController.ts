import axios from '../axios.ts'
//import { getLocalToken, getAdminUser } from '../../../api'
import { email } from '../../../api'

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
                //token: getLocalToken(), 
                user: email() 
            } 
        }
    )
    
    return data;
}

export default deleteMessages