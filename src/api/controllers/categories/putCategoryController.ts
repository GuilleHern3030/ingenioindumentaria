import { email, language, axios, devConsole } from '@/api'
import { category } from '@/api/objects/Category';

const endpoint = "/categories";

/**
 * Creates a category and put it into DataBase
 * @param {JSON} category Category in JSON format: { id, name }
 * @returns result of the request
 */
export const putCategory = async(category:category) => {

    console.log("Putting", category)

    const { data } = await axios.put(
        endpoint, 
        { category }, 
        { 
            headers: { 
                user: email(),
                lang: language 
            } 
        }
    )

    devConsole(`categories.put(${category})`, data)

    return data;
}

export default putCategory