import { email, language, axios, devConsole } from '@/api'
import query from '@/utils/QueryUtils';

const endpoint = "/attributes/all";

export const getAttributes = async(includeDisabled:boolean) => {

    const queryParams = query.set({
        disabled: includeDisabled === true,
    })
    
    const { data } = await axios.get(endpoint + queryParams,
        {
            headers: {
                user: email(),
                lang: language
            }
        }
    )

    devConsole(`attributes.selectAll(includeDisabled:${includeDisabled})`, data)

    return data;
}

export default getAttributes;