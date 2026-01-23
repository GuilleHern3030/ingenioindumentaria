import category from "@/api/models/Category";

export default {

    find(tree: category[], targetSlug: string):category {
        for (const node of tree) {

            if (node.slug === targetSlug)
                return node; // encontrado

            if (node.children && node.children.length > 0) {
                const found = this.find(node.children, targetSlug);
                if (found) return found;
            }
        }

        return null; // no encontrado
    },

    name(category: category) {
        const capitalize = (str: string) =>
            str?.length > 0 ?
                str.charAt(0).toUpperCase() + str.slice(1)
                : str
        const name = (category: category) => capitalize(
            category.slug.split("/").pop().replaceAll("-", " ")
        )
        return name(category)
    }

}