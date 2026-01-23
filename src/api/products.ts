export { default as select } from "./handlers/products/selectHandler";
export { default as selectAll } from "./handlers/products/selectAllHandler";
export { default as selectByCategory } from "./handlers/products/selectByCategoryHandler";
export { default as selectByCategoryCascade } from "./handlers/products/selectByCategoryCascadeHandler";
export { default as disable } from "./handlers/products/disableHandler";
export { default as enable } from "./handlers/products/enableHandler";
export { default as destroy } from "./handlers/products/deleteHandler";
export { default as post } from "./handlers/products/postHandler";
export { default as put } from "./handlers/products/putHandler";
export { default as count } from "./handlers/products/countHandler";

import { post, put, destroy } from './products'
import { deleteAll as deleteImages, updateImages, uploadAll as uploadImages } from './images'

import variant from "./models/Variant";
import product from "./models/Product";

interface data {
    product: product,
    slugs: string[],
    variants: variant[]
}

export const remove = async(product:product) => {
    if (!product?.id) throw new Error("El producto que deseas borrar tiene formato inválido")

    console.clear()

    const results = await deleteImages(product.images)

    const variants = product.variants
    for (let i = 0; i < variants.length; i++) 
        await deleteImages(variants[i].images)

    const result = destroy(product)

}

export const edit = async(data:data) => {
    if (!data?.product) throw new Error("Invalid format")
    
    const { product, slugs, variants } = data

    const updatedImages = await updateImages(product.images)
    for (let i = 0; i < variants.length; i++) 
        variants[i].images = await updateImages(variants[i].images)

    const result = await put(product, updatedImages, slugs, variants)

    return result
}

export const create = async(data:data) => {
    if (!data?.product) throw new Error("The product you want to create has an invalid format.")

    const { product, slugs, variants } = data

    const uploadedImages = await uploadImages(product.images)
    for (let i = 0; i < variants.length; i++) 
        variants[i].images = await updateImages(variants[i].images)

    const result = await post(product, uploadedImages, slugs, variants)

    return result;

}