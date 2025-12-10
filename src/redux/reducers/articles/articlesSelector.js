import { createSelector } from 'reselect';
import { hasPromos } from '../index/IndexSelector';

// Obtiene un array de los artículos con descuento
export const hasDiscounts = () =>
  createSelector(
    (state) => state.articles,
    (articles) => {
      return (articles?.hasDiscounts)
    }
  )

// Obtiene el nombre de una categoría
export const getCategory = (route) =>
  createSelector(
    (state) => state.categories.slugs,
    (slugs) => slugs[route],
    (slug) => StringUtils.capitalize(slug)
  )

// Obtiene los atributos de una categoría
export const getAttributes = (slug) =>
  createSelector(
    (state) => state.categories,
    (categories) => {

      console.log(categories.slugs)

      const attributesId = []
      slug.split('/').forEach((name, deep) => {
        const route = (slug.split('/').slice(0, (deep + 1))).join('/')
        console.log(route)
        const attributes = categories.slugs[route]
        attributesId.push(...attributes)
      })

      const attributes = []
      attributesId.forEach(id => {
        if (categories.attributes[id].values?.length > 0)
          attributes.push({ id, ...categories.attributes[id] })
      })

      return attributes
    }
  )