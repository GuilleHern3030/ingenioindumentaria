import axios from "../axios.ts";

const endpoint = "/users";

export const getGoogleToken = async(credentials:any) => {
    
    const { data } = await axios.put(
        endpoint, 
        credentials
    )

    return data;
}

export default getGoogleToken;