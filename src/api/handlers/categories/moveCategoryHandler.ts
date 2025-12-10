import request from '../../controllers/categories/moveCategoryController'
import handleError from '../errorHandler'
import { Category } from '@/api/objects/Category'
import { isAdmin } from '../../index'
import { useCommonI18n } from '@/hooks/useRouteI18N'

export const moveCategory = async(categorySelected:Category, categoryDestiny:Category):Promise<any> => new Promise(async(resolve, reject) => {
    const { t } = useCommonI18n()

    if (isAdmin() === true) try {

        if (categorySelected) {

            if (!categorySelected.isChildOf(categoryDestiny)) {

            console.log(`Moving ${categorySelected} to ${categoryDestiny}`)

            // Solicitar la petición al Backend
            const response = await request(categorySelected.slug(), categoryDestiny?.slug())

            // Devuelve la respuesta del Backend
            resolve(new Category(response)) // true
                
            } else reject(handleError(t("error:handle_error_body"))) 
        } else reject(handleError(t("error:handle_error_body")))
    } catch(err:any) { reject(handleError(err)) }
        else reject(handleError(t("error:session_expired")))
})

export default moveCategory