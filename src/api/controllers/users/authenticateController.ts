import axios from "../axios.ts";
const endpoint = "/users";

export const authenticate = async(username:string, password:string):Promise<Record<string,any>> => {
    
    const { data } = await axios.post(
        endpoint,
        { username, password },
        { headers: { "auth-method": "FORM" } }
    )

    return data
}

export default authenticate