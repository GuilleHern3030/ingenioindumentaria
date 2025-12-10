import { email, language, axios, devConsole } from '@/api'
import query from '@/utils/QueryUtils';

const endpoint = "/categories";

export const selectAllCategories = async(includeDisabled:boolean) => {

    const queryParams = query.set({
        disabled: includeDisabled === true,
        forceAll: true
    })

    const { data } = await axios.get(endpoint + queryParams,
        {
            headers: {
                user: email(),
                lang: language
            }
        }
    )

    devConsole(`categories.selectAll(includeDisabled:${includeDisabled})`, data)

    return data;
}

export default selectAllCategories;