import { email, language, axios, devConsole } from '@/api'
import { category } from '../../models/Category'

const endpoint = "/categories";

/**
 * Creates a category and put it into DataBase
 * @param {Record<string, any>} category Category in JSON format: { id, name }
 * @returns result of the request
 */
export const putCategory = async(category: category, applyAttributesToChildren: boolean) => {

    devConsole("categories.put", category)

    const { data } = await axios.put(
        endpoint, 
        { 
            category,
            apply_children: applyAttributesToChildren
        }, 
        { 
            headers: { 
                user: email(),
                lang: language 
            } 
        }
    )

    devConsole("categories.put response", data)


    return data;
}

export default putCategory