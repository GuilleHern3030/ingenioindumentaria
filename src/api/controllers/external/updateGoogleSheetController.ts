import { email, language, axios } from '@/api'

const endpoint = "/external/googlesheets/update";

export const updateGoogleSheet = async() => {
    
    const { data } = await axios.get(
        endpoint, 
        { 
            headers: { 
                user: email(),
                lang: language 
            } 
        } 
    )
    
    return data;
}

export default updateGoogleSheet;