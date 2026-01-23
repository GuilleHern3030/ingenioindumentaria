import request from '../../controllers/categories/moveCategoryController'
import handleError from '../errorHandler'
import { isAdmin } from '../../index'
import { useCommonI18n } from '@/hooks/useRouteI18N'
import category from '@/api/models/Category'

export const moveCategory = async (categorySelected: category, categoryDestiny: category): Promise<any> => new Promise(async (resolve, reject) => {
    const { t } = useCommonI18n()

    if (isAdmin() === true) try {

        if (categorySelected) {

            //if (!categorySelected.isChildOf(categoryDestiny)) {
            if (!categorySelected.slug.startsWith(categoryDestiny?.slug)) {

                console.log(`Moving ${categorySelected} to ${categoryDestiny}`)

                // Solicitar la petición al Backend
                const response = await request(categorySelected.slug, categoryDestiny?.slug)

                // Devuelve la respuesta del Backend
                resolve(response) // true

            } else reject(handleError(t("error:handle_error_body")))
        } else reject(handleError(t("error:handle_error_body")))
    } catch (err: any) { reject(handleError(err)) }
    else reject(handleError(t("error:session_expired")))
})

export default moveCategory