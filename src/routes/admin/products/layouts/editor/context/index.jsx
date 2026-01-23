import { createContext,  } from "react";

export const EditorContext = createContext()

export function EditorContextProvider({ product, attributes, categories, slug, children }) {
    
    return (<>
        <EditorContext.Provider value = {{ 
            attributes,
            categories,
            product,
            slug
        }}> {children}
        </EditorContext.Provider>
    </>)
}