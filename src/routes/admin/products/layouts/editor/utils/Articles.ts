import variant from "@/api/models/Variant";

export default class Articles extends Array<variant> {

    constructor(variants:variant[] = []) {
        super(...variants)
    }

    private toArray() {
        const array:variant[] = []
        for (let i = 0; i < this.length; i++)
            array.push(this[i])
        return array;
    }

    index():variant {
        return this.length > 0 ? this[0] : null
    }

    valid():boolean {
        return this.length > 0
    }

    rove(func:any) { return this.toArray().map(func) }

    delete(variant:variant) { // deletes a variant
        const array = this.toArray()
        const index = array.findIndex(article => (variant.id === null) ? article.createdAt === variant.createdAt : article.id == variant.id)
        if (index >= 0)
            array.splice(index, 1)
        return new Articles(array)
    }

    put(variant:variant) {
        const array = this.toArray()
        const index = array.findIndex(article => (variant.id === null) ? article.createdAt === variant.createdAt : article.id == variant.id)
        if (index >= 0)
            array.splice(index, 1, variant)
        else array.push(variant)
        return new Articles(array)
    }

    value(currency = '$'):string {
        const price = this.price()
        return (!isNaN(price)) ? `${currency}${price}` : null
    }

    price():number {
        let price = []
        this.forEach(variant => { price.push(variant.price) })
        return price.length ? Math.min(...price) : null
    }

    stock():number {
        let stock = 0
        this.forEach(variant => { stock += variant.stock })
        return (!isNaN(stock)) ? stock : null
    }

}