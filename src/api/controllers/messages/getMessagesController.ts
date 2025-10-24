import axios from "../axios.ts";
import { getLocalToken, getLocalUser } from '../../localtoken.ts'

const endpoint = "/messages";

export const getMessages = async() => {
    
    const { data } = await axios.get(
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

export default getMessages;