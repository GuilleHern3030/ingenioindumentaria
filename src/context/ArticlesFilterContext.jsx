import { createContext, useEffect, useState } from "react";

export const ArticlesFilterContext = createContext()

export function ArticlesFilterContextProvider(props) {
    
    const [ genderSelected, setGenderSelected ] = useState()
    const [ categorySelected, setCategorySelected ] = useState()

    const [ categoriesToShow, setCategoriesToShow ] = useState()
    const [ gendersToShow, setGendersToShow ] = useState()

    return (<>
        <ArticlesFilterContext.Provider value = {
            { 
                genderSelected, setGenderSelected,
                categorySelected, setCategorySelected,
                categoriesToShow, setCategoriesToShow,
                gendersToShow, setGendersToShow,
            }
        }>
            {props.children}
        </ArticlesFilterContext.Provider>
    </>)
}