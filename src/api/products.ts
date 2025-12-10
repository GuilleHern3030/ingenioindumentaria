export { default as get } from "./handlers/products/selectHandler";
export { default as selectAll } from "./handlers/products/selectAllHandler";
export { default as selectByCategory } from "./handlers/products/selectByCategoryHandler";
export { default as selectByCategoryCascade } from "./handlers/products/selectByCategoryCascadeHandler";
export { default as disable } from "./handlers/products/disableHandler";
export { default as enable } from "./handlers/products/enableHandler";
export { default as destroy } from "./handlers/products/deleteHandler";
export { default as post } from "./handlers/products/postHandler";
export { default as put } from "./handlers/products/putHandler";
export { default as count } from "./handlers/products/countHandler";

export { Product as default } from "./objects/Product"

import { Product, product } from "./objects/Product"
import { ProductVariant } from "./objects/ProductVariant";

import { post as postArticle, put as putArticle, destroy as removeArticle } from './products'
import { deleteAll as deleteImages, updateImages, uploadAll as uploadImages } from './images'

export const remove = async(product:Product) => {
    if (!Product.isProduct(product)) throw new Error("El producto que deseas borrar tiene formato inválido")

    console.log("Removing: ", product)

    console.log("Removing images ", product.images())
    const results = await deleteImages(product.images())
    console.log("Remove images result: ", results)

    const variants = product.variants()
    for (let i = 0; i < variants.length; i++) {
        //variants[i].Images = 
        await deleteImages(new ProductVariant(variants[i]).images())
    }

    const result = removeArticle(product)
    console.log("Remove result: ", result)

}

export const edit = async(article:product) => {
    if (!article.product) throw new Error("El producto que deseas editar tiene formato inválido")
    
    console.log("Editing: ", article)

    /*const removedImages = !article.images ? [] : article.images.filter((image:image) => image.removed === true && !image.file)
    const addedImages = !article.images ? [] : article.images.filter((image:image) => image.file && !image.removed)
    const stayedImages = !article.images ? [] : article.images.filter((image:image) => !image.file && !image.removed && image.id)

    console.log("Uploading ", addedImages)
    const uploadedImages:image[] = (addedImages.length > 0) ? await uploadImages(addedImages) : []
    console.log("Upload images result: ", uploadedImages)

    console.log("Removing ", removedImages)
    const deletedImages:image[] = (removedImages.length > 0) ? await deleteImages(removedImages) : []
    console.log("Remove images result: ", deletedImages)

    const updatedImages = [...stayedImages, ...uploadedImages]
    console.log("Updated images:", updatedImages)*/

    const updatedImages = await updateImages(article.images)
    for (let i = 0; i < article.variants.length; i++) 
        article.variants[i].Images = await updateImages(article.variants[i].Images)

    const result = await putArticle(new Product(article.product), updatedImages, article.slugs, article.attributes, article.variants)
    console.log("Edition result: ", result)

    return article
}

export const create = async(article:product) => {
    if (!article.product) throw new Error("El producto que deseas crear tiene formato inválido")

    console.log("Creating: ", article)

    /*console.log("Uploading images: ", article.images)
    const uploadedImages:image[] = await uploadImages(article.images)
    console.log("Upload images result: ", uploadedImages)*/

    const uploadedImages = await uploadImages(article.images)
    for (let i = 0; i < article.variants.length; i++) 
        article.variants[i].Images = await updateImages(article.variants[i].Images)

    const result = await postArticle(new Product(article.product), uploadedImages, article.slugs, article.attributes, article.variants)
    console.log("Creation result: ", result)

    return article;

}