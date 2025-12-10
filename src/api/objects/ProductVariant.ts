import { Attributes } from "./Attributes";
import { AttributeValue } from "./AttributeValue";
import { image } from "./Image";
import Product from "./Product";

export interface VariantAttribute {
    attributeId:number,
    attributeName?:string,
    valueId:number,
    valueName?:string
}

export interface productVariant {
    id:number,
    description?:string,
    price?:number,
    inStock?:number|null,
    discount?:number|null,
    disabled?:boolean,
    parentId?:number,
    parent?:Product,
    Attributes:VariantAttribute[],
    Images:image[]
}

export class ProductVariant {

    #json:productVariant

    toJson = () => this.#json
    static isProductVariant(obj: any): obj is ProductVariant {
        return obj instanceof ProductVariant;
    }

    static isValidProductVariantData(obj: productVariant) {
        try {
            if(obj.Attributes !== undefined) {
                if (obj.Attributes.length > 0) {
                    for (let i = 0; i < obj.Attributes.length; i++) 
                        if (obj.Attributes[i].attributeId != undefined)
                            return true
                } else return true
            }
        } catch(e) { }
        return false
    }

    static Array(productVariantArray: productVariant[]):ProductVariant[] {
        return productVariantArray.map(i => new ProductVariant(i))
    }

    constructor(json:productVariant|ProductVariant) {
        if (!json) throw new Error("json is not a valid Product")
        if (ProductVariant.isProductVariant(json)) return new ProductVariant(json.toJson())
        if (!ProductVariant.isValidProductVariantData(json)) throw new Error("Product Variant Data is not a valid Product: " + JSON.stringify(json))
        this.#json = json
    }

    isEqual = (variant:ProductVariant):boolean => {
        if (variant.id() != this.id() || this.id() == undefined || variant.id() == undefined) try {
            for (let i = 0; i < this.attributes().length; i++) {
                if(this.attributes()[i].attributeId != variant.attributes()[i].attributeId
                || this.attributes()[i].valueId != variant.attributes()[i].valueId)
                    return false
            } return true
        } catch (e) { }
        return false
    }

    id = ():number => this.#json.id
    parentId = ():number => this.#json.parentId
    isActive = ():boolean => this.#json.disabled !== true
    description = () => this.#json.description ?? this.#json.parent?.description
    price = () => this.#json.price ?? this.#json.parent?.price
    inStock = () => this.#json.inStock ?? this.#json.parent?.inStock
    discount = () => this.#json.discount ?? this.#json.parent?.discount

    attributes = ():VariantAttribute[] => this.#json.Attributes ?? []

    hasAnyValue = () => {
        for (let i = 0; i < this.attributes().length; i++) {
            if (this.attributes()[i].valueId != undefined)
                return true
        } return false
    }

    hasValue = (valueId:number) => {
        for (let i = 0; i < this.attributes().length; i++) {
            if (this.attributes()[i].valueId == valueId)
                return true
        } return false
    }

    hasAttribute = (attributeId:number) => {
        for (let i = 0; i < this.attributes().length; i++) {
            if (this.attributes()[i].attributeId == attributeId)
                return true
        } return false
    }

    value = (attributeId:number) => {
        for (let i = 0; i < this.attributes().length; i++) {
            if (this.attributes()[i].attributeId == attributeId)
                return this.attributes()[i].valueId
        } return null
    }
    
    values = (attributes:Attributes) => attributes.toArray().map(attr => {
        if (attributes) {
            const valueId = this.value(attr.id())

            if (valueId) {
                return new AttributeValue({
                    id: valueId, // value id
                    disabled: attr.get(valueId).disabled,
                    name: attr.get(valueId).name, // value name
                })
            }
            
        } else throw new Error("Attributes is not defined")
    })

    find = (filters:Record<string, string>):boolean => {
        if (!filters || Object.keys(filters).length != this.#json.Attributes.length)
            return false
        
        for (const attributeName in filters) {
            const valueName = filters[attributeName]
            const value = this.#json.Attributes.find(variantAttribute => 
                attributeName == variantAttribute.attributeName &&
                valueName == variantAttribute.valueName
            )
            if (!value) return false
        } 

        return true
    }

    filter = (filters:Record<string, string>):boolean => {
        for (const attributeName in filters) {
            if (!filters) return true
            const valueName = filters[attributeName]


            const value = this.#json.Attributes.find(variantAttribute => 
                attributeName == variantAttribute.attributeName &&
                valueName == variantAttribute.valueName
            )
            if (!value) return false;
        } 

        return true
    }

    filters = () => {
        const filters = {}
        this.attributes().forEach(attr => {
            filters[attr.attributeName] = attr.valueName
        })
        return filters;
    }

    disable = () => {
        this.#json.disabled = true
    }

    enable = () => {
        this.#json.disabled = false
    }

    setParent = (parent:Product) => {
        this.#json.parent = parent
    }

    // Images
    images = ():image[] => this.#json.Images ?? []

    deleteImage = (image:image) => {
        this.#json.Images = this.images().filter(img => img.src !== image.src)
    }

    addImage = (image:image) => {
        const images = this.images()
        images.push(image)
        this.#json.Images = images
    }

    image = (index:number=0) => {
        const image = this.images()[index]
        return image?.src
    }
}