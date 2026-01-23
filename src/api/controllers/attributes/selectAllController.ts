import { email, language, axios, devConsole } from '@/api'

const endpoint = "/attributes/all";

export const selectAll = async() => {
    
    const { data } = await axios.get(endpoint,
        {
            headers: {
                user: email(),
                lang: language
            }
        }
    )

    devConsole(`attributes.selectAll()`, data)

    return data;
}

export default selectAll;