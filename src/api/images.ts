import { imagesType, maxImageSize, maxImagesSize, maxImagesSizePerProduct, maxImagesPerProduct } from './config.json'
import { image } from "./models/Image";
import variant from "./models/Variant";
import product from "./models/Product";

export { default as delete } from "./handlers/images/deleteImageHandler";
export { default as deleteAll } from "./handlers/images/deleteImagesHandler";
export { default as uploadAll } from "./handlers/images/postImagesHandler";
export { default as upload } from "./handlers/images/postImageHandler";
export { default as size } from "./handlers/images/getImagesSizeHandler";

import uploadImages from "./handlers/images/postImagesHandler";
import deleteImages from "./handlers/images/deleteImagesHandler";
import getImagesSize from "./handlers/images/getImagesSizeHandler";

export const updateImages = async(images:image[]) => {
    const { removedImages, addedImages, stayedImages } = getImagesEdited(images)
    
    console.log("Uploading ", addedImages)
    const uploadedImages:image[] = (addedImages.length > 0) ? await uploadImages(addedImages) : []
    console.log("Upload images result: ", uploadedImages)

    console.log("Removing ", removedImages)
    const deletedImages:image[] = (removedImages.length > 0) ? await deleteImages(removedImages) : []
    console.log("Remove images result: ", deletedImages)

    const updatedImages = [...stayedImages, ...uploadedImages]
    console.log("Updated images:", updatedImages)

    return updatedImages;
}

export const verifySizeLimit = (product:product, variants:variant[]) => new Promise<number|true>(async(resolve, reject) => {

    interface Size {
        bytes: number,
        ok: boolean,
        error: number|null
    }

    const verifySize = (imagesToVerify:image[]):Size => {
        try {

            const { removedImages, addedImages, stayedImages } = getImagesEdited(imagesToVerify)
            const images = [ ...stayedImages, ...addedImages ]

            if (images.length > maxImagesPerProduct) return { bytes: 0, ok: false, error: 5 }

            let totalSize = 0

            for (let i = 0; i < images.length; i++) {
                const image = images[i]

                if (image.size > maxImageSize) return { bytes: image.size, ok: false, error: 4 }

                totalSize += image.size

                if (image.formData) try {
                    for (const pair of image.formData.entries()) {
                        const fileType = (pair[1] as any).type.split("/")[1]
                        if (!imagesType.includes(fileType)) {
                            return { bytes: 0, ok: false, error: 2 } // invalid format
                        }
                    }
                } catch(e) { }

            }

            removedImages.forEach(image => { totalSize -= image.size })

            if (totalSize > maxImagesSizePerProduct) return { bytes: totalSize, ok: false, error: 3 }

            return { bytes: totalSize, ok: true, error: null }

        } catch(e) {
            console.error(e)
            return { bytes: 0, ok: false, error: 2 }
        }
    }

    const productOk = verifySize(product.images)
    let totalSize = productOk.bytes

    const checks = variants.map(variant => {
        const result = verifySize(variant.images)
        totalSize += result.bytes
        return result
    })
    
    let ok:number|boolean;
    if (productOk.ok === true) {
        ok = checks.find(check => check.ok !== true)?.error ?? true
    } else ok = productOk.error

    if (ok === true) try {

        const imagesSize = await getImagesSize() // KB de imágenes en la base de datos
        console.log(`Images Size of Data Base: ${imagesSize} bytes / ${maxImagesSize} bytes`)
        console.log(`Total Size of upload: ${totalSize} bytes`)
        if ((imagesSize + totalSize) > maxImagesSize)
            resolve(6)

        else 
            resolve(true)
        
    } catch(e) { reject(e) }
    else resolve(ok)
    

})

const getImagesEdited = (images:image[]) => {
    const removedImages = !images ? [] : images.filter((image:image) => image.removed === true && !image.file)
    const addedImages = !images ? [] : images.filter((image:image) => image.file && !image.removed)
    const stayedImages = !images ? [] : images.filter((image:image) => !image.file && !image.removed && image.id)
    return {
        removedImages,
        addedImages,
        stayedImages
    }
}