import { attribute, value } from "@/api/models/Attribute";

interface attributeData extends attribute {
    slugs: string[]
}

export class Attribute {

    id: number
    name: string
    values: value[]
    slugs: string[]
    disabled: boolean

    constructor(attributeData: attributeData) {
        this.id = attributeData?.id ?? null
        this.name = attributeData?.name ?? ''
        this.values = attributeData?.values ?? []
        this.slugs = attributeData?.slugs ?? []
        this.disabled = attributeData?.disabled ?? false
    }

    toJson = () => ({
        id: this.id,
        name: this.name,
        values: this.values,
        slugs: this.slugs,
        disabled: this.disabled
    })

    slice = () => new Attribute(this.toJson())

    hasValue = (valueName: string) =>
        this.values.find(value => value.name == valueName) != undefined

    addValue = (valueName: string) => {
        this.values.push({
            id: null,
            name: valueName,
            disabled: false
        })
        return this.slice()
    }

    renameValue = (prevValue:string, newValue:string) => {
        const index = this.values.findIndex(value => prevValue == value.name)
        if (index >= 0) this.values[index].name = newValue
        return this.slice()
    }

    disableValue = (valueName:string) => {
        const index = this.values.findIndex(value => valueName == value.name)
        if (index >= 0) this.values[index].disabled = true
        return this.slice()
    }

    enableValue = (valueName:string) => {
        const index = this.values.findIndex(value => valueName == value.name)
        if (index >= 0) this.values[index].disabled = false
        return this.slice()
    }

    removeValue = (valueName:string) => {
        const index = this.values.findIndex(value => valueName == value.name)
        if (index >= 0) this.values.splice(index, 1)
        return this.slice()
    }

    addCategory = (categorySlug:string) => {
        if (!this.slugs.includes(categorySlug))
            this.slugs.push(categorySlug)
        return this.slice()
    }

    removeCategory = (categorySlug:string) => {
        const index = this.slugs.findIndex(slug => categorySlug == slug)
        if (index >= 0) this.slugs.splice(index, 1)
        return this.slice()
    }

}

export default Attribute