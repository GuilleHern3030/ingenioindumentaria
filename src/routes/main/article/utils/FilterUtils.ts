import product from "@/api/models/Product";
import variant from "@/api/models/Variant";

/** Un filter es un json simple donde cada key es el attributeName y el value es el valueName
 *      Ejemplo: {
 *                  "Talle": "XL",
 *                  "Color": "Marron"
 *               }
 */
// 

export default {

    // Obtiene los filtros de la URL
    url() {
        const params: Record<string, string> = getParamsFromURL()
        try { delete params.o } catch (e) { }
        try { delete params.p } catch (e) { }
        return Object.entries(params).length > 0 ? params : null
    },

    // Filtra las variantes según filtros
    selectVariants(o: product | variant[], filters: Record<string, string>): variant[] {
        const variants: variant[] = (o as product).variants ?? (o as variant[])
        const filteredVariants = filters ? variants.filter(article => 
            Object.entries(filters).every(([attributeName, valueName]) =>
                article.attributes.some(
                    attr =>
                        attr.attributeName === attributeName &&
                        attr.valueName === valueName
                )
            )
        ) : variants
        return filteredVariants
    },

    // Filtra las variantes según filtros y selecciona el primero
    selectVariant(o: product | variant[], filters: Record<string, string>): variant | null {
        const filteredVariants = this.selectVariants(o, filters)
        return filteredVariants?.length > 0 ? filteredVariants[0] : null
    },

    // Filtra las variantes según filtros y devuelve las variantes no filtradas
    unselectVariants(o: product | variant[], filters: Record<string, string>): variant[] {
        const variants: variant[] = (o as product).variants ?? (o as variant[])
        if (Object.keys(filters).length == 0) return variants
        const filteredVariants: variant[] = this.selectVariants(o, filters)
        return variants.filter(v => filteredVariants.find(fv => fv.id == v.id))
    },

    // Obtener los atributos disponibles de un producto o conjunto de variantes
    availableAttributes(o: product | variant[]) {
        const variants: variant[] = (o as product).variants ?? (o as variant[])
        const attributes = variants.map((variant: variant) => variant.attributes).flat()
        const result = {}
        attributes.forEach(({ attributeName, valueName }) => {
            result[attributeName] ??= []
            if (!result[attributeName].includes(valueName)) {
                result[attributeName].push(valueName)
            }
        })
        return result
    },

    // Obtener los filtros disponibles de un producto o conjunto de variantes filtrados
    availableFilters(o: product | variant[], filters: Record<string, string>) {
        const variants = this.unselectVariants(o, filters)
        const result = this.availableAttributes(variants)
        return result
    },

    // Obtener los filtros de una variante de producto
    getFilters(variant: variant): Record<string, string> {
        if (!variant) return {}
        const filters = Object.fromEntries(
            variant.attributes.map(a => [a.attributeName, a.valueName])
        )
        return filters
    }

}


const getParamsFromURL = () => {
    const filters: Record<string, string> = {}
    const url = window.location.href
    const paramsIndex = url.indexOf('?') + 1
    if (paramsIndex > window.location.hostname.length) {
        const search = new URLSearchParams(url.substring(paramsIndex))
        search.forEach((value, key) => {
            filters[key] = value
        })
    }
    return filters
}


/*selectVariants = (filter:Record<string, string>) => {
    const variants = this.variants().map(variant => new ProductVariant(variant))
    if (!filter || Object.keys(filter).length == 0) return Object.assign(new ProductVariants(), variants);
    return Object.assign(new ProductVariants(), variants.filter(variant => variant.filter(filter)))
}*/