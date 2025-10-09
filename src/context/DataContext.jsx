import { createContext, useState, useEffect } from "react";
import { data_uri, basename } from '../data/references.json'
const LINKS_URI = basename+data_uri

export const DataContext = createContext();

export function DataContextProvider(props) {

    const [ data, setData ] = useState()

    useEffect( () => {
      fetch(LINKS_URI)
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => setData(null))
    }, []);

    return (<>
        <DataContext.Provider value = {{ data }}>
            {props.children}
        </DataContext.Provider>
    </>)
}
