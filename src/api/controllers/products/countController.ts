import { email, language, axios, devConsole } from '@/api'
import query from '@/utils/QueryUtils';

const endpoint = "/products/count";

/**
 * Get products in JSON format
 * @returns Promise with a JSON of products
 */
const selectByCategory = async(slug:string, includeDisabled:boolean, cascade:boolean) => {
    //if (loadFromBackend === false) throw new Error("Backend Service storage is not allowed")
    
    const queryParams = query.set({
        disabled: includeDisabled === true,
        slug: slug ?? ''
    })

    const { data } = await axios.get(endpoint + queryParams,
        {
            headers: {
                user: email(),
                lang: language
            }
        }
    )
    
    devConsole(`products.count(${slug}, ${includeDisabled}, ${cascade})${queryParams}`, data)

    return data;
}

export default selectByCategory