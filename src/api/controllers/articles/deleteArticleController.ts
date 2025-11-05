import axios from '../axios.ts'
import { email } from '../../../api'

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
                //token: getLocalToken(), 
                user: email() 
            } 
        }
    )
    
    return data;
}

export default deleteArticle