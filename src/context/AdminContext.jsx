import { createContext, useState, useEffect } from "react";
import { dbPull as loadDataBase } from '../hooks/useIndexedDB';
import { getLocalUser } from "../api/localtoken";

const USE_CLOUDFLARE_AUTHENTICATION = false

export const AdminContext = createContext()

export function AdminContextProvider(props) {

    const isLogged = () => {
        if (USE_CLOUDFLARE_AUTHENTICATION === false)
            return getLocalUser() != null
        else return () => true
    }

    const [ articlesEdited, setArticlesEdited ] = useState([])

    useEffect( () => {
        loadDataBase().then(articles => {
            console.log("Admin loaded", articles)
        })
    }, []);

    return (<>
        <AdminContext.Provider value = {{ isLogged, articlesEdited, setArticlesEdited }}>
            {props.children}
        </AdminContext.Provider>
    </>)
}