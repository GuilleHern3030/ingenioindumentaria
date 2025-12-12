import { AttributeValue, value } from "./AttributeValue"
import { AttributeValues } from "./AttributeValues"

export interface attribute {
    id:number,
    name:string,
    AttributeValues?:value[],
    values?:value[],
    disabled:boolean,
    category?:any[]
}

const newAttribute = (name:string) => new Attribute({
        id: undefined,
        name,
        AttributeValues: [],
        disabled: false
})

export class Attribute {

    #json:attribute
    
    constructor(object:attribute|Attribute|string) { 
        if (Attribute.isAttribute(object)) return new Attribute(object.toJson())
        if (typeof(object) === 'string') return newAttribute(object)
        if (!object) throw new Error('Undefined Attribute object')
        this.#json = object
    }

    static isAttribute(obj: any): obj is Attribute {
        return obj instanceof Attribute;
    }

    toJson = () => this.#json

    id = () => this.#json.id
    name = () => this.#json.name
    categories = () => this.#json.category ?? []
    slugs = () => this.#json.category?.map(cat => cat.slug) ?? []
    rawValues = () => this.#json.AttributeValues ?? []

    values = (onlyActives=true) => {
        const attributeValues = this.#json.AttributeValues ?? this.#json.values
        const values = onlyActives !== true ? attributeValues :
            attributeValues.filter(value => value.disabled !== true)
        return Object.assign(new AttributeValues(), values)
    }

    isActive = (value?:string) => {
        if (!value) {
            const hasAnyValueActived = true//this.values().some(v => !this.valuesInactives().includes(v.toString()))
            return this.#json.disabled !== true && hasAnyValueActived == true
        } else return this.getValue(value)?.isActive()

    }

    rename = (name:string) => {
        if (name?.length > 0)
            this.#json.name = name
        return this.slice()
    }

    disable = (includeValues = false) => {
        this.#json.disabled = true;
        if (includeValues === true) 
            this.values().disableAll()
        return this.slice()
    }

    enable = (includeValues = false) => {
        this.#json.disabled = false
        if (includeValues === true) 
            this.values().enableAll()
        return this.slice()
    }

    hasValue = (value:string|AttributeValue, onlyActives=true) => {
        return this.values().has(value, onlyActives)
    }

    getValue = (value:string) => 
        this.values(false).get(value)

    get = (value:string|AttributeValue|number) => {
        if (value) {
            const index = this.valueIndex(value)
            if (index >= 0)
                return this.#json.AttributeValues[index]
        }
    }
    
    valueIndex = (value:string|AttributeValue|number) => {
        if (value) try {
            const search = typeof(value) === 'string' || typeof(value) === 'number' ? 
                value : value.name
            let index = 0
            for (index = 0; index < this.#json.AttributeValues.length; index++) {
                if (typeof(value) === 'number' && this.#json.AttributeValues[index].id == search
                || this.#json.AttributeValues[index].name == search)
                    return index
            }
        } catch(e) { console.warn(e) }
        return -1
    }

    addValue = (value:string|AttributeValue) => {
        this.#json.AttributeValues.push(AttributeValue.new(value).toJson())
        return this.slice()
    }

    removeValue = (value:string|AttributeValue) => {
        const index = this.valueIndex(value)
        if (index >= 0)
            this.#json.AttributeValues.splice(index, 1)
        return this.slice()
    }

    renameValue = (prevValue:string|AttributeValue, newValue:string|AttributeValue) => {
        if (!this.hasValue(newValue)) {
            const index = this.valueIndex(prevValue)
            if (index >= 0)
                this.#json.AttributeValues[index].name = typeof(newValue) === 'string' ? newValue : newValue.toString()
        }
        return this.slice()
    }
    
    disableValue = (value:string|AttributeValue) => {
        const index = this.valueIndex(value)
        if (index >= 0)
            this.#json.AttributeValues[index].disabled = true
        return this.slice()
    }
    
    enableValue = (value:string|AttributeValue) => {
        const index = this.valueIndex(value)
        if (index >= 0)
            this.#json.AttributeValues[index].disabled = false
        return this.slice()
    }

    slice = () => new Attribute(this)
    

}