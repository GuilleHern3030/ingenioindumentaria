import axios from '../axios.ts'
import { getLocalToken, getLocalUser } from '../../../api'

const endpoint = "/articles";

/**
 * Creates an article and put it into DataBase
 * @param {JSON} article Article in JSON format
 * @returns result of the request
 */
export const postArticle = async(article:any) => {

    const { data } = await axios.post(
        endpoint, 
        article, 
        { 
            headers: { 
                token: getLocalToken(), 
                user: getLocalUser() 
            } 
        }
    )

    return data;
}

export default postArticle