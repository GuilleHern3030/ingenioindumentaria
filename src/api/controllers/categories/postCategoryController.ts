import { email, language, axios, devConsole } from '@/api'

const endpoint = "/categories";

/**
 * Creates a category and put it into DataBase
 * @param {JSON} category Category in JSON format: { category, parentId }
 * @returns result of the request
 */
export const postCategory = async(categoryName:string, parentSlug:string) => {

    const { data } = await axios.post(
        endpoint, 
        {  
            name: categoryName,
            parentSlug
        }, 
        { 
            headers: { 
                //token: getLocalToken(), 
                user: email(),
                lang: language
            } 
        }
    )
    
    devConsole(`categories.post(${categoryName}, ${parentSlug})`, data)

    return data;
}

export default postCategory