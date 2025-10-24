import request from '../../controllers/images/postImageController.ts'
import { maxImageSize, imagesType } from '../../config.json'
import Article from '../../objects/Article.ts'

/**
 * Upload an image to DataBase
 * @param img Image in FormData
 * @returns Promise with JSON object with format { src:string, size:string } 
 */
export const postImage = async(img:Record<string, any>, article:Article|undefined):Promise<any> => new Promise(async(resolve, reject) => {

    try {

        if (!img.size || img.size && Number(img.size) < maxImageSize) {

            if (img.formData) {
                for (const pair of img.formData.entries()) {
                    const fileType = pair[1].type.split("/")[1]
                    if (!imagesType.includes(fileType)) {
                        reject("El formato de imagen no está permitido")
                        return;
                    }
                }
            }

            // Solicitar la petición al Backend
            const newSrc = await request(img.formData)

            // Armando nuevo objeto img
            const newImg = {
                src: newSrc,
                size: img.size
            }
                    
            // Añade la imagen al Article
            if (article !== undefined && Article.isArticle(article))
                article.addImage(newImg)

            // Devuelve la respuesta del Backend
            console.log("Imagen subida satisfactoriamente:", newImg)
            resolve(newImg)

        } else reject(`La imagen supera el límite máximo de ${maxImageSize/1000} KB`)

    } catch(err:any) {
        console.error(err)
        try {
            const message = err.response.data.message ? err.response.data.message : err.message
            reject(message)
        } catch (e) { // no message received (server shutdown?)
            const message = err.message
            reject(message)
        }
    }
})

export default postImage