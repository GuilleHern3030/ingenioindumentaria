import axios from '../axios.ts'
import { getLocalToken, getLocalUser } from '../../../api'

const endpoint = "/articles";

/**
 * Deletes an article from DataBase
 * @param {number} id Article id
 * @returns result of the request
 */
export const deleteArticle = async(id:number) => {

    const { data } = await axios.delete(
        endpoint + "/" + id, 
        { 
            headers: { 
                token: getLocalToken(), 
                user: getLocalUser() 
            } 
        }
    )
    
    return data;
}

export default deleteArticle