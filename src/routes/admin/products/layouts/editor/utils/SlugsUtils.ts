import category from "@/api/models/Category"

export default {

    getSelected(categories:category[], slug:string):string[] {
        if (categories) {
            const slugs:string[] = categories.map(category => category.slug)
            if (slug && !slugs.includes(slug)) slugs.push(slug)
            return slugs
        } else return slug ? [ slug ] : []
    }
    
}