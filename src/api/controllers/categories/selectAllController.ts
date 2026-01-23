import { email, language, axios, devConsole } from '@/api'

const endpoint = "/categories/all";

export const selectAllCategories = async () => {

    const { data } = await axios.get(endpoint,
        {
            headers: {
                user: email(),
                lang: language
            }
        }
    )

    devConsole(`categories.selectAll()`, data)

    return data;
}

export default selectAllCategories;