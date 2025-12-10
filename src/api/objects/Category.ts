import { Attribute, attribute } from "./Attribute";
import { Attributes } from "./Attributes";

const capitalize = (str:string) => str?.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str

export interface category {
    Attributes:attribute[],
    children:category[],
    disabled:boolean,
    slug:string
}

export class Category {

    #json:category;

    constructor(json:category) { 
        if (!json) throw new Error("Category is not defined")
        if (Category.isCategory(json)) return new Category(json.toJson())
        this.#json = json 
    }

    static isCategory(obj: any): obj is Category {
        return obj instanceof Category;
    }

    toJson = () => this.#json

    name = () => capitalize((this.isChildren()) ? 
        this.toSlug().pop().replaceAll("-", " ") : this.slug())

    attributes = () => Object.assign(new Attributes(), this.#json.Attributes)

    isActive = () => this.#json.disabled !== true

    children = () => (this.#json.children?.length > 0) ? 
        this.#json.children.map((child:category) => new Category(child)) : []

    isChildren = () => this.#json.slug.includes("/")

    isRoot = () => !this.#json.slug.includes("/")

    slug = () => this.#json.slug

    toSlug = () => this.#json.slug.split("/")

    deep = () => this.#json.slug.split("/").length

    slugs = () => {
        const parts = this.toSlug()
        const slugs = []
        for (let i = 1; i <= parts.length; i++)
            slugs.push(parts.slice(0, i).join('/'))
        return slugs;
    }

    setAttributes = (attributes:attribute[]) => {
        this.#json.Attributes = attributes
    }

    toString = () => this.#json.slug

    isChildOf = (slug:string|Category) => slug ? 
        this.slug().startsWith(slug.toString()) : false

}