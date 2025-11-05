import axios from "../axios.ts";
//import { getLocalToken, getAdminUser } from '../../../api'
import { email } from '../../../api'

const endpoint = "/messages";

export const getMessages = async() => {
    
    const { data } = await axios.get(
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

export default getMessages;