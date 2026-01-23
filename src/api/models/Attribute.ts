/**
 * Atributos correspondientes a una categoría / producto
 */

export interface attribute {
    id:number,
    name:string,
    AttributeValues?:value[],
    values?:value[],
    disabled:boolean,
    category?:any[]
}

export interface value {
    id:number,
    name:string,
    disabled:boolean
}

export interface attributevalue { 
    attributeId: number, 
    attributeName: string, 
    valueId: number, 
    valueName: string 
}

export default attribute