import { email, language, axios, devConsole } from '@/api'
import query from '@/utils/QueryUtils';

const endpoint = "/categories/disable";

/**
 * Creates a category and put it into DataBase
 * @param {JSON} category Category in JSON format: { id, name }
 * @returns result of the request
 */
export const disableCategory = async(slug:string, applyToChildren?:boolean) => {

    const queryParams = query.set({
        force: applyToChildren === true,
        slug
    })

    const { data } = await axios.delete(
        endpoint + queryParams, 
        { 
            headers: { 
                //token: getLocalToken(), 
                user: email(),
                lang: language 
            } 
        }
    )
    
    devConsole(`categories.disable(${slug}, ${applyToChildren})`, data)

    return data;
}

export default disableCategory