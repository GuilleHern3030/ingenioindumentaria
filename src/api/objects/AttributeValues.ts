import { AttributeValue, value } from "./AttributeValue";

const findValue = (array:value[], value:string|AttributeValue) => {
    let val = null;
    let found = false;
    let index = 0;

    if (array && value) {
        for (index = 0; index < array.length; index++) {
            val = array[index]
            if(AttributeValue.isAttributeValue(value) && val.name == value.name()
            || typeof(value) === 'string' && val.name == value) {
                found = true
                break;
            }
        }
    }

    return (found == true) ? {
        valueData: val,
        index
    } : {
        valueData: undefined,
        index: -1
    }
}

export class AttributeValues extends Array<value> {

    static get(array:value[], value:string|AttributeValue) {
        return findValue(array, value)
    }

    toArray = () => this.map(i => new AttributeValue(i))

    get = (value:string|AttributeValue) => {
        const { valueData } = findValue(this, value)
        return (valueData) ? new AttributeValue(valueData) : null
    }

    has = (value:string|AttributeValue, onlyActives=true) => {
        const val = this.get(value)
        if (val) {
            return onlyActives === true ? val.isActive() : true
        } return false

    }

    rename = (prevName:string, newName:string) => {
        const value = this.get(prevName)
        value.rename(newName)
    }

    disableAll = () => {
        this.forEach(valueData => {
            valueData.disabled = true
        })
    }

    enableAll = () => {
        this.forEach(valueData => {
            valueData.disabled = false
        })
    }

    remove = (value:string|AttributeValue) => {
        const { index } = findValue(this, value)
        if (index >= 0) 
            this.splice(index, 1)
    }

    add = (value:string|AttributeValue) => {
        const { index } = findValue(this, value)
        if (index == -1)
            this.push(new AttributeValue(value).toJson())
    }

    disable = (value:string|AttributeValue) => {
        const { valueData } = findValue(this, value)
        if (valueData) 
            valueData.disabled = true
    }

    enable = (value:string|AttributeValue) => {
        const { valueData } = findValue(this, value)
        if (valueData) 
            valueData.disabled = false
    }

}