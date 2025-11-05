import axios from "../axios.ts";
const endpoint = "/users";

export const authenticate = async(credential:string) => {

    const { data } = await axios.post(
        endpoint,
        { credential },
        { headers: { "auth-method": "GOOGLE" } }
    )

    return data
}

export default authenticate