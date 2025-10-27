import { createContext, useState, useEffect } from "react";
import { getLocalUser } from "../api";

const USE_CLOUDFLARE_AUTHENTICATION = false

export const AdminContext = createContext()

export function AdminContextProvider(props) {

    const isLogged = () => {
        if (USE_CLOUDFLARE_AUTHENTICATION === false)
            return getLocalUser() != null
        else return () => true
    }

    return (<>
        <AdminContext.Provider value = {{ isLogged }}>
            {props.children}
        </AdminContext.Provider>
    </>)
}