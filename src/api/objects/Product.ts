import { image } from "./Image";
import { Attributes } from "./Attributes";
import { ProductVariant, productVariant } from "./ProductVariant";
import { ProductVariants } from "./ProductVariants";
export interface product {
    product:Record<string, any>,
    slugs?:string[],
    images?:image[],
    attributes?:any[],
    variants?:any[]
}

export class Product {

    #json:Record<string, any>;

    toJson = () => this.#json
    static isProduct(obj: any): obj is Product {
        return obj instanceof Product;
    }

    constructor(json:Record<string, any>) {
        if (!json) throw new Error("json is not a valid Product")
        if (Product.isProduct(json)) return new Product(json.toJson())
        this.#json = json
    }

    // Atributos propios
    id = ():number => this.#json.id
    name = ():string => this.#json.name
    description = ():string => this.#json.description
    discount = ():number => this.#json.discount
    inStock = ():number => this.#json.inStock
    isActive = ():boolean => this.#json.disabled !== true
    isRecent = (): boolean => this.#json.isRecent

    price = (digits?:number):number|string => (!digits) ?
        Number(this.#json.price) :
        Number(this.#json.price).toFixed(digits)

    // Atributos relacionados
    categories = ():any[] => this.#json.Categories ?? this.#json.categories ?? []
    images = ():any[] => this.#json.Images ?? this.#json.images ?? []
    attributes = ():any[] => Object.assign(new Attributes(), this.#json.Attributes ?? [])
    variants = ():ProductVariants => Object.assign(new ProductVariants(), this.#json.ProductVariants ? this.#json.ProductVariants : [])

    selectVariant = (filter:number|Record<string, string>) => {
        if (filter) {
            if (typeof(filter) === 'number' || typeof(filter) === 'string') {
                const productVariant = this.variants().find(v => v.id == filter)
                if (productVariant) return new ProductVariant(productVariant)
            } else {
                const productVariant:ProductVariant = 
                    this.variants().map(variant => new ProductVariant(variant)).find(v => v.find(filter))
                if (productVariant) 
                    return productVariant
            }
        }
    }

    selectVariants = (filter:Record<string, string>) => {
        const variants = this.variants().map(variant => new ProductVariant(variant))
        if (!filter || Object.keys(filter).length == 0) return Object.assign(new ProductVariants(), variants);
        return Object.assign(new ProductVariants(), variants.filter(variant => variant.filter(filter)))
    }

    availableAttributes = (params?:Record<string, string>) => {
        const availableAttrs:Record<string, string[]> = this.variants().availableAttributes()
        if (!params) return availableAttrs
        const filters = {}
        Object.entries(params).forEach(([attribute, attributeValue]) => {
            Object.entries(availableAttrs).find(([key, array]) => {
                if(key.toLowerCase() == attribute.toLowerCase()) {
                    const val = array.find((value:string) => value.toLowerCase() == attributeValue.toLowerCase())
                    if (val) filters[key] = val
                }
            })

        })
        return filters
    }

    slugs = () => this.categories().map(category => category.slug)

    // Editores
    deleteImage = (image:Record<string, any>) => {
        this.#json.Images = this.images().filter(img => img.src !== image.src)
    }

    addImage = (image:Record<string, any>) => {
        const images = this.images()
        images.push(image)
        this.#json.Images = images
    }

    image = (index:number=0) => {
        const image = this.images()[index]
        return image?.src
    }

    salePrice = (digits:number=0) => this.discount() > 0 ?
        (Number(this.price()) - Number(this.price()) * this.discount() / 100).toFixed(digits) :
        Number(this.price()).toFixed(digits)
}

export default Product