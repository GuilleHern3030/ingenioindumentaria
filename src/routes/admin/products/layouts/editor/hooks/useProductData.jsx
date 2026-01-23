import { useContext } from 'react'
import { EditorContext } from '../context'

export default () => {

    const { product, categories, attributes, slug } = useContext(EditorContext)

    const parseData = (id, name, description, newest, disabled, image, slugs, variants) => ({
        product: {
            id,
            name,
            description,
            newest, // isRecent
            disabled,
            images: image ? [image] : [],
            price: variants?.price()
        },
        slugs,
        variants: variants?.toArray()
    })

    return { product, categories, attributes, slug, parseData }
}