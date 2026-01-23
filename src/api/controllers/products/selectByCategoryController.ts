import { email, language, axios, devConsole } from '@/api'
import query from '@/utils/QueryUtils';

const endpoint = "/products/category";

/**
 * Get products in JSON format
 * @returns Promise with a JSON of products
 */
const selectByCategory = async(slug:string) => {
    //if (loadFromBackend === false) throw new Error("Backend Service storage is not allowed")
    
    const queryParams = query.set({
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
    
    devConsole(`products.selectCategory(slug:'${slug}')${queryParams}`, data)

    return data;
}

export default selectByCategory