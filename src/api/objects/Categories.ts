import { Category, category } from "./Category";

export class Categories {

    #json:category[];

    static isCategory(obj: any): obj is Categories {
        return obj instanceof Categories;
    }

    static toSlug(obj: any[]):Array<string> {
        if (Array.isArray(obj)) 
            return obj.map(o => o.slug)
    }

    constructor(json:category[]) { 
        if (!json) throw new Error("Categories is not defined")
        if (Categories.isCategory(json)) return new Categories(json.toJson())
        this.#json = json 
    }

    toJson = () => this.#json

    toString = () => JSON.stringify(this.#json)

    toSlug = () => this.#json.map((category:Record<string, any>) => category.slug)

    toArray = () => {

    }

    toTree = () => {

    }

    parseSlug = (slug:string) => slug.toLowerCase().replace(/\s+/g, '-')

    children = (slug:string='') => {
        // separar el slug en partes: ropa/hombre → ['ropa', 'hombre']
        const parts = slug.toLowerCase().split('/').filter(Boolean);

        // navegar recursivamente el árbol según las partes
        let current = this.#json;
        for (const part of parts) {
            const found = Object.keys(current).find(
                key => key.toLowerCase() === part
            );
            if (!found) return []; // el slug no existe
            current = current[found]; // avanzar al siguiente nivel
        }

        // devolver los nombres de las subcategorías (children)
        return Object.keys(current);
    }

    slugChildren = (slug:string='') => this.children(slug).map(s => `${slug && slug+'/'}${s}`)

    get = (slug:string) => findCategoryBySlug(this.#json, slug)

    mainCategories = () => this.#json.map(root => new Category(root))

}


function findCategoryBySlug(tree:category[], targetSlug:string) {
    for (const node of tree) {

        if (node.slug === targetSlug)
            return new Category(node); // encontrado

        if (node.children && node.children.length > 0) {
            const found = findCategoryBySlug(node.children, targetSlug);
            if (found) return found;
        }
    }

    return null; // no encontrado
}