import { createContext, useState, useEffect } from "react";
import { getLocalUser } from "../api";

export const AdminContext = createContext()

export function AdminContextProvider(props) {

    const isLogged = () => {
        return getLocalUser() != null
    }

    return (<>
        <AdminContext.Provider value = {{ isLogged }}>
            {props.children}
        </AdminContext.Provider>
    </>)
}