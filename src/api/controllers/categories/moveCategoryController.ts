import { email, language, axios, devConsole } from '@/api'

const endpoint = "/categories/move";

/**
 * Creates a category and put it into DataBase
 * @param {JSON} categories categories in JSON format: { category, to }
 * @returns result of the request
 */
export const move = async(slug:string, destinySlug:string) => {

    const { data } = await axios.put(
        endpoint, 
        {
            slug,
            to: destinySlug
        }, 
        { 
            headers: { 
                //token: getLocalToken(), 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`categories.move(${slug} -> ${destinySlug})`, data)

    return data;
}

export default move