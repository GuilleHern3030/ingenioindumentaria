import { maxImageSize, imagesType, maxImagesSize, maxImagesPerProduct, maxImagesSizePerProduct } from '@/api/config.json'
import Size from '@/utils/SizeUtils'

export const getSize = (images:any[], baseSize:number=0) => {
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

interface invalidError {
    error:string,
    message:string
}

export interface image {
    src:string,
    size:number,
    id?:number,
    removed?:boolean,
    formData?: any,
    file?: File
}

export interface images {
    added?:image[],
    removed?:image[],
    stayed?:image[]
}

// Perteneciente/s a un producto
export class Image {

    static isImage(obj: any): obj is Image {
        return obj instanceof Image;
    }

    /**
     * Verifica que un File cumple con los requisitos de una imagen
     * @param {File} file archivo que se verificará 
     * @returns {true|invalidError} true si es válido, un objeto {error, message} si hay un error
     */
    static isValid(file:File): true|invalidError {

        // Validar tamaño de imagen
        if (file.size > maxImageSize) return {
            error:"La imagen es demasiado grande para procesarla",
            message:`El tamaño máximo permitido es ${Size.toString(maxImageSize)} pero tu imagen tiene un tamaño de ${Size.toString(file.size)}`
        }

        // Validar extensión
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !imagesType.includes(fileExtension)) return {
            error: "Extensión de imagen inválida",
            message: `Solo se permiten imágenes de tipo ${imagesType.join(", ")}. Tu archivo es de tipo ${fileExtension}`
        }

        // Validar por MIME type (más seguro)
        const mimeType = file.type; // ej: "image/png"
        if (!mimeType.startsWith("image/")) return {
            error: "Tipo de archivo inválido",
            message: `Solo se permiten imágenes de tipo ${imagesType.join(", ")}.`
        }

        return true

    }

    /**
     * Verifica que un conjunto de imágenes cumple con los requisitos del servidor
     * @param {any[]} images conjunto de imágenes que se verificarán, las cuales deben tener el atributo 'size'
     * @param {number|undefined} baseSize tamaño base con el que se hará la verificación, 0 en caso de no definirlo
     * @returns {true|invalidError} true si es válido, un objeto {error, message} si hay un error
     */
    static areValid(images:any[], baseSize?:number): true|invalidError {

        // Validar tamaño de las imágenes
        const totalSize = getSize(images, baseSize)
        if (totalSize > maxImagesSizePerProduct) return {
            error:"Las imagenes son demasiado grandes para procesarlas",
            message:`El tamaño máximo permitido es ${Size.toString(maxImagesSizePerProduct)}. Tu conjunto de imagenes tiene un tamaño de ${Size.toString(totalSize)}.`
        }
        
        // Validar tamaño de las imágenes
        images.forEach((image:any) => {
            if (image?.size > maxImageSize) return {
                error:"Una de las imagenes es demasiado grande para procesarla",
                message:`El tamaño máximo permitido es ${Size.toString(maxImageSize)} pero una imagen tiene un tamaño de ${Size.toString(image.size)}`
            }
        })

        // Validar cantidad de imágenes
        if (images.length > maxImagesPerProduct) return {
            error:"Hay demasiadas imágenes",
            message:`El máximo de imágenes permitidas por producto es de ${maxImagesPerProduct}. Tienes ${images.length}.`
        }

        return true

    }
}

// Todas las imagenes existentes en todos los productos existentes
export class Images {

    static isImages(obj: any): obj is Images {
        return obj instanceof Images;
    }

    /**
     * Verifica que un conjunto de imágenes cumple con los requisitos del servidor
     * @param {any[]} images conjunto de TODAS las imágenes del website, las cuales deben tener el atributo 'size'
     * @param {number|undefined} baseSize tamaño base con el que se hará la verificación, 0 en caso de no definirlo
     * @returns {true|invalidError} true si es válido, un objeto {error, message} si hay un error
     */
    static isValid(images:any[], baseSize?:number): true|invalidError {

        // Validar tamaño de las imágenes
        const totalSize = getSize(images, baseSize)
        if (totalSize > maxImagesSize) return {
            error:"Las imagenes son demasiado grandes para procesarlas",
            message:`El tamaño máximo permitido es ${Size.toString(maxImagesSize)}. Tu conjunto de imagenes tiene un tamaño de ${Size.toString(totalSize)}.`
        }
        
        // Validar tamaño de las imágenes
        images.forEach((image:any) => {
            if (image?.size > maxImageSize) return {
                error:"Una de las imagenes es demasiado grande para procesarla",
                message:`El tamaño máximo permitido es ${Size.toString(maxImageSize)} pero una imagen tiene un tamaño de ${Size.toString(image.size)}`
            }
        })

        return true

    }
}