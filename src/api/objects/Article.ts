import { isValidFormat } from '../models/Article.ts'

const parseImages = (images:Array<any>) => images.map(image => `${image.src}¬${image.size}`).join(",")

const parseDate = (isoString:string) => {
    const splittedISOString = (isoString.length > 0) ? isoString.split('T') : new Date().toISOString().split('T')
    const fecha = splittedISOString[0].split('-')
    const hora = splittedISOString[1].split('.')[0].split(':')

    return {
        day: fecha[2],
        month: fecha[1],
        year: fecha[0],
        hour: hora[0],
        minute: hora[1],
        second: hora[2],
        date: fecha.join('-'),
        time: hora[0] + ":" + hora[1],
        complete: fecha.slice().reverse().join('/') + " - " + hora.join(':'),
        ISOString: isoString // "YYYY-MM-DDThh:mm:ss.mmmZ"
    }
}

export class Article {

    #json:Record<string, any>;

    static isArticle(obj: any): obj is Article {
        return obj instanceof Article;
    }

    constructor(json:Record<string, any>) {
        if (!isValidFormat(json))
            throw new Error("json is not a valid Article")
        this.#json = json
    }

    name = () => this.#json.Name
    id = () => Number(this.#json.ID)
    category = () => this.#json.Category
    description = () => this.#json.Description
    price = () => this.#json.Price.length == 0 ? 0 : Number(this.#json.Price)
    discount = () => this.#json.Discount.length == 0 ? 0 : Number(this.#json.Discount)
    sizes = () => this.#json.Sizes.split(',')
    sex = () => this.#json.Sex.split(',')
    recent = () => this.#json.Recent !== 'F'
    inStock = () => this.#json.InStock.split(',').map((stock:string|number) =>
        (!stock || Number(stock) === 0) ? false : (isNaN(Number(stock))) ? true : Number(stock)
    )

    date = () => parseDate(this.#json.Date)

    priceText = (symbol:string = "$", thousandSeparator:string = ",", decimalSeparator = ".") => {
        const price = `${this.price()}`
        return `${symbol}${price}`
    }

    priceDiscounted = () => this.price()-this.price()*this.discount()/100

    sexName = () => {
        if (this.#json.Sex == 'M') return "Hombre"
        else if (this.#json.Sex == 'F') return "Mujer"
        else if (this.#json.Sex == 'B') return "Niño"
        else if (this.#json.Sex == 'G') return "Niña"
        else if (this.#json.Sex == 'BG' || this.#json.Sex == 'GB') return "Unisex niño"
        else if (this.#json.Sex == 'Y') return "Bebé"
        else return "Unisex"
    }

    images = ():Array<any> => {
        if (this.#json.ImageSrc.length == 0) return []
        else return this.#json.ImageSrc.split(',').map((img:string) => {
            const imgInfo = img.split("¬")
            return {
                src: imgInfo[0],
                size: imgInfo[1]
            }
        })
    }

    size = ():number => {
        const images = this.images()
        let size = 0;
        if (images.length > 0) images.forEach(image => { 
            if (image.size && image.size > 0)
                size += Number(image.size)
        })
        return size;
    }

    getImage = (index:number) => {
        try {
            return this.images()[index]
        } catch(e) {
            return null
        }
    }

    stringifyImages = () => {
        const images = this.images()
        if (images.length > 0)
            return parseImages(images)
        else return ""
    }

    addImage = (image:Record<string, any>) => {
        const images = this.images()
        images.push({ src: image.src, size: image.size })
        this.#json.ImageSrc = parseImages(images)
    }

    deleteImage = (image:Record<string, any>) => {
        const images = this.images()
        for (let index = 0; index < images.length; index++) {
            if (images[index].src === image.src) {
                images.splice(index, 1)
                break;
            }
        }
        this.#json.ImageSrc = parseImages(images)
    }

    json = () => this.#json;

}

export default Article