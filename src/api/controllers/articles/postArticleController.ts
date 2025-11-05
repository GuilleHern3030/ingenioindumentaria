import axios from '../axios.ts'
//import { getLocalToken, getAdminUser } from '../../../api'
import { email } from '../../../api'

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
                //token: getLocalToken(), 
                user: email() 
            } 
        }
    )

    return data;
}

export default postArticle