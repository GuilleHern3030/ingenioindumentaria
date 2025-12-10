import { email, language, axios, devConsole } from '@/api'

const endpoint = "/categories";

export const getCategories = async(includeDisabled:boolean) => {
    
    const params = includeDisabled === true ? '?disabled=true' : ''

    const { data } = await axios.get(endpoint + params,
        {
            headers: {
                user: email(),
                lang: language
            }
        }
    )
    
    devConsole(`categories.get(${includeDisabled})`, data)

    return data;
}

export default getCategories;