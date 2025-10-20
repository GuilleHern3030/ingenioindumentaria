import { createContext, useState, useEffect } from "react";
import { data_uri, basename } from '../assets/data/data.json'
const LINKS_URI = basename+data_uri

export const ClientInfoContext = createContext();

export function ClientInfoContextProvider(props) {

    const [ data, setData ] = useState()

    useEffect( () => {
      fetch(LINKS_URI)
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => setData(null))
    }, []);

    return (<>
        <ClientInfoContext.Provider value = {{ data }}>
            {props.children}
        </ClientInfoContext.Provider>
    </>)
}
