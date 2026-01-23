import attribute from "@/api/models/Attribute";

class Attributes extends Array<attribute> {

    // Obtiene el index de un atributo dentro de un array de attributes
    index = (attribute:attribute, onlyActives:boolean=true):number => {
        return this.findIndex(attr => 
            (onlyActives === true && attr.disabled === false || onlyActives === false) && attr.id === attribute.id
        )
    }

    // Verifica que un atributo está dentro de un array de atributos
    has = (attribute:attribute, onlyActives:boolean=true):boolean => {
        return this.index(attribute, onlyActives) != -1
    }

    // Añade un attribute dentro de un array de attributes
    add = (attribute:attribute):Attributes => {
        if (!this.has(attribute, false))
            this.push(attribute)
        return this.slice() as Attributes
    }

    // Remueve un attribute de un array de attributes
    remove = (attribute:attribute):Attributes => {
        const index = this.index(attribute, false)
        if (index >= 0) this.splice(index, 1)
        return this.slice() as Attributes
    }

    // Devolver el array original
    toArray = () => super.slice()

}

export default Attributes