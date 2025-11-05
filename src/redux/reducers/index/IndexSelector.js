import { createSelector } from 'reselect';

const getValue = (array, key) => {
    if (Array.isArray(array))
    for (let i = 0; i < array.length; i++) {
        if (key == array[i].key)
            return array[i].value
    }
}

// Obtiene un array de los nombres de los géneros existentes
export const getGenders = () =>
  createSelector(
    (state) => state.index.index,
    (index) => {
        try {
            const genderCategories = getValue(index, 'genders')
            const genders = []
            for (const gender in genderCategories)
                genders.push(gender)
            return genders
        } catch(e) {
            return []
        }
    }
)

// Obtiene un array de los nombres de las categorías existentes para un género
export const getCategories = (genderCategory) =>
  createSelector(
    (state) => state.index.index,
    (index) => {
        try {
            const genderCategories = getValue(index, 'gendercategories')
            const genders = getValue(index, 'genders')
            const gender = genders[genderCategory]
            return genderCategories[gender]
        } catch(e) {
            return []
        }
    }
)

// Obtiene un array de las categorías con más artículos
export const getMost = (length=4) =>
  createSelector(
    (state) => state.index.index,
    (index) => {
        try {
            const categories = getValue(index, 'category')
            const categoriesList = Object.entries(categories).map(([key, value]) => [key, value.length])
            categoriesList.sort((a, b) => b[1] - a[1])
            
            const categoriesName = categoriesList.map(([key, _]) => key)

            return categoriesName.splice(0, length)
        } catch(e) {
            return []
        }
    }
)

export const hasRecent = () => 
  createSelector(
    (state) => state.index.index,
    (index) => {
        const ids = getValue(index, 'recent')
        return ids ? ids.length > 0 : false
    }
)

export const hasPromos = () => 
  createSelector(
    (state) => state.index.index,
    (index) => {
        const ids = getValue(index, 'promotion')
        return ids ? ids.length > 0 : false
    }
)