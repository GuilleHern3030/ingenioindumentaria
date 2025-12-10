import { email, language, axios, devConsole } from '@/api'

const endpoint = "/categories/rename";

/**
 * Creates a category and put it into DataBase
 * @param {JSON} category Category in JSON format: { id, name }
 * @returns result of the request
 */
export const renameCategory = async(slug:string, newName:string) => {

    const { data } = await axios.put(
        endpoint, 
        {
            slug,
            name: newName
        }, 
        { 
            headers: { 
                //token: getLocalToken(), 
                user: email(),
                lang: language 
            } 
        }
    )

    devConsole(`categories.rename(${slug}, ${newName})`, data)

    return data;
}

export default renameCategory