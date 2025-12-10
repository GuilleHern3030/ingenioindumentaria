import { createContext, useState, useEffect } from "react";
import { data_uri, basename } from '../assets/data/data.json'

const THEME_LOCALSTORAGE = "theme"

export const ThemeContext = createContext();

export function ThemeContextProvider(props) {

    const [ theme, setTheme ] = useState(() => {

        // Si el usuario ya eligió tema → usar ese
        const saved = localStorage.getItem(THEME_LOCALSTORAGE);
        if (saved) return saved;

        // Si nunca eligió → usar tema del sistema
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
    })

    useEffect(() => {

        // Aplicar clase al HTML
        if (theme === "dark") 
            document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        
        // Guardar preferencia del usuario
        localStorage.setItem(THEME_LOCALSTORAGE, theme);

    }, [theme])

    return (<>
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </ThemeContext.Provider>
    </>)
}
