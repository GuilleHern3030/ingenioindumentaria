import { ProductVariant, productVariant } from "./ProductVariant";

export class ProductVariants extends Array<ProductVariant|productVariant> {

    toArray = () => this.map(i => new ProductVariant(i))

    availableAttributes = (filters?:Record<string, string>) => {

        const variants = filters ?
            this.map(variant => new ProductVariant(variant)).find(v => v.find(filters))
            : this

        const attributes = {} 

        if (variants) {

            this.map(variant => new ProductVariant(variant).attributes())
            .forEach(attribute => {
                attribute.forEach(attr => {
                    if (!attributes[attr.attributeName])
                        attributes[attr.attributeName] = new Set()
                    attributes[attr.attributeName].add(attr.valueName)
                })
            })
            
            for(const key in attributes)
                attributes[key] = [...attributes[key]]
        }
        
        return attributes ?? {}
    }

    getVariantFilters = (variantId:number) => {
        const filters = {}
        try {
            const variant = this.find(v => v.id == variantId || (ProductVariant.isProductVariant(v) && v.id() == variantId))
            const variantData = (ProductVariant.isProductVariant(variant)) ? variant.toJson() : variant
            variantData?.Attributes?.forEach(attribute => {
                filters[attribute.attributeName] = attribute.valueName
            })
        } catch(e) { }
        return filters
    }

}