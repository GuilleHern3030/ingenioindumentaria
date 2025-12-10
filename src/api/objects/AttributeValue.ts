export interface value {
    id:number,
    name:string,
    disabled:boolean
}

const newValue = (name:string) => new AttributeValue({
        id: undefined,
        name,
        disabled: false
})

export class AttributeValue {

    #json:value
    
    constructor(object:value|AttributeValue|string) { 
        if (!object) return null
        if (AttributeValue.isAttributeValue(object)) return new AttributeValue(object.toJson())
        if (typeof(object) === 'string') return newValue(object)
        this.#json = object 
    }

    static new(value:value|string|AttributeValue) {
        return newValue(value.toString())
    }

    static isAttributeValue(obj: any): obj is AttributeValue {
        return obj instanceof AttributeValue;
    }

    toJson = () => this.#json

    toString = () => this.#json.name

    name = () => this.#json.name

    id = () => this.#json.id

    isActive = () => this.#json.disabled !== true

    enable = () => { this.#json.disabled = false }

    disable = () => { this.#json.disabled = true }

    rename = (name:string) => {
        this.#json.name = name
    }

}