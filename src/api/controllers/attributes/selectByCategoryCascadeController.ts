import { email, language, axios, devConsole } from '@/api'
import query from '@/utils/QueryUtils';

const endpoint = "/attributes/categories";

/**
 * Get products in JSON format
 * @returns Promise with a JSON of products
 */
const selectByCategoryCascade = async(slug:string, includeDisabled:boolean) => {
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

    devConsole(`attributes.selectCascade(includeDisabled:${includeDisabled}, ${slug})`, data)

    return data;
}

export default selectByCategoryCascade