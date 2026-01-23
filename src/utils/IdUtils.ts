import String from './StringUtils'

interface serializedId {
    id:number,
    slug:string,
    variantId:number
}

function isId(str:string):boolean {
    if (typeof(str) == 'string' && str?.length > 0) {
        const l = (str.charCodeAt(0))
        return l >= 65 && l <= 90
    } return false
}

export default {
    
    serialize(id:number, variantId?:number, slug?:string):string {
        const slugString = slug?.length > 0 ? `${slug}/` : ''
        return `${slugString}${String.numberToLetters(Number(id))}${variantId??''}`
    },

    parse(serializedId:string):serializedId {
        if(serializedId) {
            const splitted = serializedId.split('/')
            const ids = splitted.pop()
            const slug = (splitted.length > 0) ? splitted.join("/") : isId(ids) ? '' : serializedId
            const index = ids.search(/\d/) // index del primer número
            const id = isId(ids) ? String.lettersToNumber( (index > 0) ? ids.substring(0, index) : ids ) : undefined
            const variantId = (index > 0 && isId(ids)) ? Number(ids.substring(index)) : undefined
            return { slug, id, variantId }
        }
    },

    id(serializedId:string):string {
        if(serializedId) {
            const splitted = serializedId.split('/')
            const ids = splitted.pop()
            const index = ids.search(/\d/) // index del primer número
            const id = (index > 0) ? ids.substring(0, index) : ids
            return id
        }
    },

    url(articleId:number, slug?:string, variantId?:number):string {
        const serialized = this.serialize(articleId, variantId, slug)
        return `${location.protocol}//${location.hostname}/article/${serialized}`
    }
}