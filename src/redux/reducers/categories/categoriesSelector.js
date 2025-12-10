import { Categories } from '@/api/objects/Categories';
import { Attributes } from '@/api/objects/Attributes';
import { createSelector } from 'reselect';
import StringUtils from '@/utils/StringUtils';

// Obtiene un array de las categorías (slug) hijas de una categoría
export const getSlugs = (route = '') =>
  createSelector(
    (state) => state.categories.slugs,
    (slugs) => {
      const slug = route.length > 0 ? route + '/' : route
      return slugs ? Object.keys(slugs).filter(s =>
        s.startsWith(slug) &&
        !s.substring(slug.length).includes('/')
      ) : []
    }
  )

// Obtiene un árbol de slugs
export const getCategories = () =>
  createSelector(
    (state) => state.categories.slugs,
    (slugs) => {
      const tree = {}
      for (const slug in slugs) {
        const cleanSlug = slug.trim()
        const parts = cleanSlug.split("/")
        let current = tree;
        for (const part of parts) {
          if (!current[part])
            current[part] = {}
          current = current[part];
        }
      }
      return tree
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

      if (!slug) return []

      console.time("getAttributes")

      const selectAttributes = slug => {
        const attributesId = []
        slug.split('/').forEach((name, deep) => {
          try {
            const route = (slug.split('/').slice(0, (deep + 1))).join('/')
            const attributes = categories.slugs[route]
            attributesId.push(...attributes)
          } catch (e) { }
        })

        const attributes = []
        attributesId.forEach(id => {
          if (categories.attributes[id].values?.length > 0)
            attributes.push({ id, ...categories.attributes[id] })
        })

        return attributes
      }

      let attributes = []
      if (typeof (slug) === 'string')
        attributes.push(...selectAttributes(slug))
      else {
        slug.forEach(s => { attributes.push(...selectAttributes(s)) })
        attributes = Array.from(new Map(attributes.map(item => [item.id, item])).values())
      }

      console.timeEnd("getAttributes")
      return attributes
    }
  )