import { maxImageSize, imagesType, maxImagesSize, maxImagesPerProduct, maxImagesSizePerProduct } from '@/api/config.json'

const getSize = (images:any[], baseSize:number=0) => {
    let size = baseSize;
    try {
        images.forEach(img => {
            if (img?.size) 
                size += img.size 
        })
    } 
    catch(e) { console.error(e) } 
    finally { return size }
}

export default {

    isValid(file:File): number|true {

        // Validar tamaño de imagen
        if (file.size > maxImageSize) return 1 // `Imagen muy grande. El tamaño máximo permitido es ${Size.toString(maxImageSize)} pero tu imagen tiene un tamaño de ${Size.toString(file.size)}`

        // Validar extensión
        const fileExtension = file.name.split('.').pop()?.toLowerCase()
        if (!fileExtension || !imagesType.includes(fileExtension)) return 2//`Solo se permiten imágenes de tipo ${imagesType.join(", ")}. Tu archivo es de tipo ${fileExtension}`

        // Validar por MIME type (más seguro)
        const mimeType = file.type; // ej: "image/png"
        if (!mimeType.startsWith("image/")) return 2//`Solo se permiten imágenes de tipo ${imagesType.join(", ")}.`

        return true

    },

    areValid(images:any[], baseSize?:number): number|true {
    
        // Validar tamaño de las imágenes
        const totalSize = getSize(images, baseSize)
        if (totalSize > maxImagesSizePerProduct) return 3
        /*if (totalSize > maxImagesSizePerProduct) return {
            error:"Las imagenes son demasiado grandes para procesarlas",
            message:`El tamaño máximo permitido es ${Size.toString(maxImagesSizePerProduct)}. Tu conjunto de imagenes tiene un tamaño de ${Size.toString(totalSize)}.`
        }*/
        
        // Validar tamaño de las imágenes
        images.forEach((image:any) => {
            if (image?.size > maxImageSize) return 4
            /*if (image?.size > maxImageSize) return {
                error:"Una de las imagenes es demasiado grande para procesarla",
                message:`El tamaño máximo permitido es ${Size.toString(maxImageSize)} pero una imagen tiene un tamaño de ${Size.toString(image.size)}`
            }*/
        })

        // Validar cantidad de imágenes
        if (images.length > maxImagesPerProduct) return 5
        /*if (images.length > maxImagesPerProduct) return {
            error:"Hay demasiadas imágenes",
            message:`El máximo de imágenes permitidas por producto es de ${maxImagesPerProduct}. Tienes ${images.length}.`
        }*/

        return true

    }

}