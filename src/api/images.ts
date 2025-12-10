import { image } from "./objects/Image";

export { default as delete } from "./handlers/images/deleteImageHandler";
export { default as deleteAll } from "./handlers/images/deleteImagesHandler";
export { default as uploadAll } from "./handlers/images/postImagesHandler";
export { default as upload } from "./handlers/images/postImageHandler";

import uploadImages from "./handlers/images/postImagesHandler";
import deleteImages from "./handlers/images/deleteImagesHandler";

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

const getImagesSize = (images:image[]) => {
    
}