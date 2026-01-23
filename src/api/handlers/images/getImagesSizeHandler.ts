import request from '@/api/controllers/images/getImagesSizeController'
import handleError from '../errorHandler'

/**
 * Gets the total images size from DataBase
 * @returns Promise with size in KB
 */
export const getImagesSize = async():Promise<number> => new Promise(async(resolve, reject) => {

    try {

        const size = await request()
        resolve(size)

    } catch(err:any) { reject(handleError(err)) }
})

export default getImagesSize