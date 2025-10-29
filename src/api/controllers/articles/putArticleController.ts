import axios from '../axios.ts'
import { getLocalToken, getAdminUser } from '../../../api'

const endpoint = "/articles";

/**
 * Puts an article into DataBase
 * @param {JSON} article Article in JSON format
 * @returns result of the request
 */
export const putArticle = async(article:any) => {

    const { data } = await axios.put(
        endpoint, 
        article, 
        { 
            headers: { 
                token: getLocalToken(), 
                user: getAdminUser() 
            } 
        }
    )
    
    return data;
}

export default putArticle