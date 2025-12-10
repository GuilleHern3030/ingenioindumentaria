interface serializedId {
    id:number,
    slug:string,
    variantId:number
}

function numberToLetters(num:number):string {
    let result = '';

    while (num > 0) {
        num--; // Ajuste porque no hay "0" (A=1)
        const char = String.fromCharCode(65 + (num % 26)); // 65 = 'A'
        result = char + result;
        num = Math.floor(num / 26);
    }

    return result;
}

function lettersToNumber(str:string):number {
    let result = 0;

    for (let i = 0; i < str.length; i++) {
        result = result * 26 + (str.charCodeAt(i) - 64); 
        // 'A' = 65 → 65 - 64 = 1
    }

    return result;
}

export default {
    serialize(id:number, variantId?:number, slug?:string):string {
        const slugString = slug?.length > 0 ? `${slug}/` : ''
        return `${slugString}${numberToLetters(Number(id))}${variantId??''}`
    },

    parse(serializedId:string):serializedId {
        if(serializedId) {
            const splitted = serializedId.split('/')
            const ids = splitted.pop()
            const slug = (splitted.length > 0) ? splitted.join("/") : ''
            const index = ids.search(/\d/) // index del primer número
            const id = lettersToNumber( (index > 0) ? ids.substring(0, index) : ids )
            const variantId = (index > 0) ? Number(ids.substring(index)) : undefined
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