import axios from "../axios.ts";

const endpoint = "/authenticate";

export const validateToken = async(token:string) => {
    
    const { data } = await axios.get(
        endpoint, 
        { 
            headers: { 
                token 
            } 
        }
    )

    return data;
}

export default validateToken;