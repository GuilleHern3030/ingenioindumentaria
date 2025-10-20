import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";

export default function() {

    const { isLoading, setIsLoading, isLogged, setIsLogged } = useContext(AuthenticationContext)

    

    return {
        isLoading, 
        setIsLoading,
        isLogged, 
        setIsLogged
    }

}