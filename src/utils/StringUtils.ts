export default {

  capitalize(str:string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  lastSlug(slug:string) {
    const str = slug.split('/').pop()
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  slugToCollection(slug:string) {
    if (slug) {
      const categories = this.capitalizeAll(slug).split('/')
        .reverse()
        .map((category:string) => category.replaceAll('-', ' '))

      return categories.join(" - ")
    } return ''
  },

  slugToArray(slug:string):string[] {
    const parts = slug.split('/')
    const result = []
    for (let i = parts.length; i > 0; i--) 
        result.push(parts.slice(0, i).join('/'))
    return result.reverse()
  },

  capitalizeAll(str:string) {
    return str.split('/').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('/')
  },

  hasSpecialCharacter(str:string) {
    return /[\/\-\_\!\,\.]/.test(str)
  },

  lettersToNumber(str:string):number {
    let result = 0
    const strCaps = str.toUpperCase()

    for (let i = 0; i < strCaps.length; i++) {
        result = result * 26 + (strCaps.charCodeAt(i) - 65)
        // 'A' = 65 → 65 - 65 = 0
    }

    return result
  },

  numberToLetters(num:number):string { // caps
    let result = ''

    while (num > 0) {
        const char = String.fromCharCode(65 + (num % 26)) // 65 = 'A'
        result = char + result
        num = Math.floor(num / 26)
    }

    return result
  }

}