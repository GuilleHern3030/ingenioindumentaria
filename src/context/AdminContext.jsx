import { createContext } from "react";
//import { isAdminSignedIn } from "../api";

export const AdminContext = createContext()

export function AdminContextProvider(props) {

    /*const isLogged = () => {
        return isAdminSignedIn()
    }*/

    return (<>
        <AdminContext.Provider value = {{ isLogged }}>
            {props.children}
        </AdminContext.Provider>
    </>)
}