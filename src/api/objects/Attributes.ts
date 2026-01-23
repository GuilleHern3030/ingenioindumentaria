import { Attribute, attribute } from "./Attribute";
import { AttributeValue } from "./AttributeValue";
import { AttributeValues } from "./AttributeValues";

const findAttribute = (attributes:attribute[], attribute:string|Attribute|number) => {
    let found = false;
    let index = 0;

    if (attributes && attribute) {
        for (index = 0; index < attributes.length; index++) {
            if(Attribute.isAttribute(attribute) && attributes[index].name == attribute.name()
            || typeof(attribute) === 'string' && attributes[index].name == attribute
            || typeof(attribute) === 'number' && attributes[index].id == attribute) {
                found = true
                break;
            }
        }
    }

    return found == true ? {
        attributeData: attributes[index],
        index
    } : {
        attributeData: undefined,
        index: -1
    }
}

const findValue = (attributes:attribute[], attribute:string|Attribute, value:string|AttributeValue) => {
    const { attributeData } = findAttribute(attributes, attribute)
    const { valueData, index } = AttributeValues.get(attributeData?.AttributeValues, value)
    return { attributeData, valueData, index }
}


export class Attributes extends Array<attribute> {

    static get(attributes:attribute[], attribute:string|Attribute) {
        return findAttribute(attributes, attribute)
    }

    static isAttributes(obj: any): obj is Attributes {
        return obj instanceof Attributes;
    }

    /**
     * Convierte los filtros en formato string a formato id
     * @param {Record<string, string>} filters Filtros con formato { attributeName: valueName }
     * @returns {Record<number, number>} Filtros con formato { attributeId, valueId }
     */
    static toFilters(filters:Record<string, string>, attributesData:Record<string, any>):Record<number, number> {
        const attributes = Object.assign(new Attributes(), attributesData)
        let parsedFilters:Record<number, number> = {}
        Object.entries(filters).forEach(([attributeName, valueName]) => {
            const filter = attributes.getFilter(attributeName, valueName)
            parsedFilters = { ...parsedFilters, ...filter }
        })
        return parsedFilters
    }

    toArray = () => this.map(i => new Attribute(i))

    get = (attribute:string|Attribute|number) => {
        const { attributeData } = findAttribute(this, attribute)
        return attributeData ? new Attribute(attributeData) : null
    }

    has = (attribute:string|Attribute, onlyActives=true) => {
        const attr = this.get(attribute)
        if (attr) {
            return onlyActives === true ? attr.isActive() : true
        } return false

    }

    attributeIndex = (attribute:string|Attribute) => {
        const { index } = findAttribute(this, attribute)
        return index        
    }

    rename = (attribute:string|Attribute, name:string) => {
        const { attributeData } = findAttribute(this, attribute)
        if (attributeData)
            attributeData.name = name
        return this.slice()
    }

    add = (attribute:string|Attribute) => {
        if (!this.has(attribute))
            this.push(new Attribute(attribute).toJson())
        return this.slice()
    }

    remove = (attribute:string|Attribute) => {
        const { index } = findAttribute(this, attribute)
        if (index >= 0)
            this.splice(index, 1)
        return this.slice()
    }

    disable = (attribute:string|Attribute, includeValues=false) => {
        //const { attributeData } = findAttribute(this, attribute)
        const attr = this.get(attribute)
        if (attr?.isActive()) 
            attr.disable(includeValues)
        return this.slice()
    }

    enable = (attribute:string|Attribute, includeValues=false) => {
        const attr = this.get(attribute)
        if (attr && !attr.isActive()) 
            attr.enable(includeValues)
        return this.slice()
    }

    hasValue = (attribute:string|Attribute, value:string|AttributeValue, onlyActives=true) => {
        const attr = this.get(attribute)
        if (attr)
            return attr.hasValue(value, onlyActives)
        return false
    }

    getFilter = (attribute:string|Attribute, value:string|AttributeValue, onlyActives=true) => {
        const attr = this.get(attribute)
        if (attr && attr.hasValue(value, onlyActives)) {
            return JSON.parse(`{ "${attr.id()}":${attr.getValue(value.toString()).id()} }`)
        }
    }

    addValue = (attribute:string|Attribute, value:string|AttributeValue) => {
        const { valueData, attributeData } = findValue(this, attribute, value)
        if (attributeData && !valueData)
            attributeData.AttributeValues.push(new AttributeValue(value).toJson())
        return this.slice()
    }

    removeValue = (attribute:string|Attribute, value:string|AttributeValue) => {
        const { index, attributeData } = findValue(this, attribute, value)
        if (index >= 0)
            attributeData.AttributeValues.splice(index, 1)
        return this.slice()
    }

    disableValue = (attribute:string|Attribute, value:string|AttributeValue) => {
        const { index, valueData } = findValue(this, attribute, value)
        if (index >= 0)
            valueData.disabled = true
        return this.slice()
    }

    enableValue = (attribute:string|Attribute, value:string|AttributeValue) => {
        const { index, valueData } = findValue(this, attribute, value)
        if (index >= 0)
            valueData.disabled = false
        return this.slice()
    }

    renameValue = (attribute:string|Attribute, value:string|AttributeValue, name:string) => {
        const { index, valueData } = findValue(this, attribute, value)
        console.log(index)
        if (index >= 0)
            valueData.name = name
        return this.slice()
    }
}

export default Attributes