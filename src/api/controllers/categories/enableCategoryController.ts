import { email, language, axios, devConsole } from '@/api'

const endpoint = "/categories/enable";

/**
 * Creates a category and put it into DataBase
 * @param {JSON} category Category in JSON format: { id, name }
 * @returns result of the request
 */
export const enableCategory = async(slug:string) => {

    const { data } = await axios.put(
        endpoint, 
        { slug }, 
        { 
            headers: { 
                //token: getLocalToken(), 
                user: email(),
                lang: language 
            } 
        }
    )
    
    devConsole(`categories.enable(${slug})`, data)

    return data;
}

export default enableCategory