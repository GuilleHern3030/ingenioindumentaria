import { useState } from "react"
import Article, { getArticles, genders } from "../api"

const DATA_BASE = "IngenioIndumentaria"
const ARTICLES = "Articles" // Todos los articulos disponibles
const CATEGORIES = "Categories" // Nombre de las categorias

/**
 * Convierte todos los Set que se encuentren en un objeto en Array
 * @param {*} value Objeto al que se le quiere quitar los Set
 * @returns Devuelve el objeto con todos sus Set convertidos en Array
 */
function replaceSetsWithArrays(value) {
  if (value instanceof Set) {
    // Convierte Set → Array
    return Array.from(value);
  }

  // Si es un array, recorremos sus elementos
  if (Array.isArray(value)) {
    return value.map(replaceSetsWithArrays);
  }

  // Si es un objeto (y no null), recorremos sus propiedades
  if (value && typeof value === "object") {
    const result = {};
    for (const key in value) {
      result[key] = replaceSetsWithArrays(value[key]);
    }
    return result;
  }

  // Si es un valor primitivo, lo devolvemos igual
  return value;
}

function obtainGenders(gendercategories) {
    const gendersObject = { }
    try {
        for (const gender in gendercategories) {
            const genderName = genders[gender] != undefined ? 
                genders[gender] : "Unisex"
            gendersObject[genderName] = gender
        }
    } catch(e) { }
    return gendersObject
}

// Convierte el nombre de un género en la letra que lo identifica
function parseGender(genderName) {
    if (genderName && genderName.length > 1) {
        for (const gender in genders) {
            if (genders[gender] === genderName)
                return gender
        }
    } else return genderName
}

const open = async() => new Promise((resolve, reject) => {
    const IDBrequest = window.indexedDB.open(DATA_BASE, 1)
    IDBrequest.onupgradeneeded = () => {
        const db = IDBrequest.result
        db.createObjectStore(ARTICLES, { keyPath: "ID" } /*{ autoIncrement: true }*/)
        db.createObjectStore(CATEGORIES, { keyPath: "key" })
    }
    IDBrequest.onerror = e => reject(e)
    IDBrequest.onsuccess = event => {
        IDBrequest["event"] = event
        IDBrequest["close"] = () => event.target.result.close()
        resolve(IDBrequest)
    }
})

const read = (IDBrequest, objectStore) => {
    const db = IDBrequest.event.target.result
    const transaction = db.transaction(objectStore, "readonly")
    const store = transaction.objectStore(objectStore)
    return { db, transaction, store }
}

const write = (IDBrequest, objectStore) => {
    const db = IDBrequest.event.target.result
    const transaction = db.transaction(objectStore, "readwrite")
    const store = transaction.objectStore(objectStore)
    return { db, transaction, store }
}

const clear = async() => {
    return new Promise(resolve => {
        const IDBrequest = window.indexedDB.deleteDatabase(DATA_BASE)
        IDBrequest.onsuccess = () => resolve()
        IDBrequest.onerror = () => resolve()
    })
}

export const size = async() => open().then(IDBrequest => 
    new Promise((resolve, reject) => {
        const { db, store } = read(IDBrequest, ARTICLES)
        let size = 0
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                size += Number(new Article(object).size())
                cursor.result.continue()
            } else { // All objects were readed
                db.close()
                resolve(size)
            }
        })
        cursor.onerror = e => reject(e)
    })
)

export const pull = async(articles) => new Promise(async resolve => {
    try {
        const objectStore = (articles != undefined) ? articles :
            await getArticles()

        await clear()
        await put(objectStore)

        const indexs = await getIndex()

        resolve({ articles: objectStore, index: indexs })
    } catch(e) {
        console.error(e)
        resolve(null)
    }
})

const put = async(articles) => {
    if (articles == undefined) throw new Error("Articles is not defined") 
    if (!Array.isArray(articles)) throw new Error("Articles is not an Array") 
    
    const addArticles = async(IDBrequest, articles) => {
        return new Promise(resolve => {
            const { transaction, store } = write(IDBrequest, ARTICLES)
            articles.forEach(article => {
                store.add(article.json())
            })
            transaction.addEventListener("complete", () => resolve())
        })
    }

    const addCategories = async(IDBrequest, articles) => {

        const add = (json, arrayKey, id) => json[arrayKey] == undefined ? ( json[arrayKey] = new Set(), json[arrayKey].add(id) ) : json[arrayKey].add(id)

        const categoriesId = { } // Categorías
        const sexId = { } // Sexo
        const sizesId = { } // Talles
        const sexCategories = { } // Categorías por sexo
        const recentId = new Set() // Recientes
        articles.forEach(article => {
            const id = article.id()
            add(categoriesId, article.category(), id)
            article.sex().forEach(sex => { 
                add(sexId, sex, id) 
                add(sexCategories, sex, article.category())
            })
            article.sizes().forEach(size => { add(sizesId, size, id) })
            if (article.recent() === true) recentId.add(id)
        })
        return new Promise(resolve => {
            const { transaction, store } = write(IDBrequest, CATEGORIES)
            store.add({ key: "recent", value: recentId})
            store.add({ key: "category", value: categoriesId})
            store.add({ key: "gendercategories", value: sexCategories})
            store.add({ key: "sex", value: sexId })
            store.add({ key: "size", value: sizesId })
            transaction.addEventListener("complete", () => resolve())
            //resolve()
        })
    }

    return await open().then(async IDBrequest => {
        const addAllArticles = async() => {
            await addArticles(IDBrequest, articles)
            await addCategories(IDBrequest, articles)
            IDBrequest.event.target.result.close()
            return articles
        }
        return await addAllArticles()
    })
}

const length = async() => open().then(IDBrequest => 
    new Promise(resolve => {
        const db = IDBrequest.event.target.result
        const tx = db.transaction(ARTICLES, "readonly");
        const store = tx.objectStore(ARTICLES);
        const countRequest = store.count();
        countRequest.onsuccess = () => {
            const count = countRequest.result;
            db.close()
            resolve(count);
        };
        countRequest.onerror = () => resolve(0);
    })
)

const maxId = async() => open().then(IDBrequest => 
    new Promise(resolve => {
        let maxId = 0
        const db = IDBrequest.event.target.result
        const tx = db.transaction(ARTICLES, "readonly")
        const store = tx.objectStore(ARTICLES)
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                const article = new Article(object)
                if (article.id() > maxId)
                    maxId = article.id()
                cursor.result.continue()
            } else { // All objects were readed
                db.close()
                resolve(maxId)
            }
        })
    })
)

export const getIndex = async () => open().then(IDBrequest => 
    new Promise(resolve => {
        const index = []
        const { db, store } = read(IDBrequest, CATEGORIES)
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                index.push(object)
                if (object.key === 'gendercategories')
                    index.push({ key: 'genders', value: obtainGenders(object.value) })
                cursor.result.continue()
            } else { // All objects were readed
                db.close()
                resolve(replaceSetsWithArrays(index))
            }
        })
    })
)

const selectAll = async() => open().then(IDBrequest => 
    new Promise(resolve => {
        const articles = []
        const { db, store } = read(IDBrequest, ARTICLES)
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                articles.push(new Article(object))
                cursor.result.continue()
            } else { // All objects were readed
                db.close()
                resolve(articles)
            }
        })
    })
)

const hasContent = async() => open().then(IDBrequest => 
    new Promise(resolve => {
        const { db, store } = read(IDBrequest, ARTICLES)
        const countRequest = store.count();
        countRequest.onsuccess = () => {
            const count = countRequest.result;
            db.close()
            resolve(count > 0);
        };
        countRequest.onerror = () => resolve(false);
    })
)

const selectGenders = async() => open().then(IDBrequest =>
    new Promise(async (resolve, reject) => {
        const { db, store } = read(IDBrequest, CATEGORIES)
        const cursor = store.get('sex')
        cursor.onsuccess = () => {
            const gendersObject = { }
            const options = cursor.result.value
            for (const gender in options) {
                const genderName = genders[gender] != undefined ? 
                    genders[gender] : "Unisex"
                gendersObject[genderName] = gender
            }
            db.close()
            resolve(gendersObject)
        }
        cursor.onerror = e => { reject(e) }
    })
)

const selectCategoriesOfGender = async(gender) => open().then(IDBrequest => 
    new Promise(resolve => {
        const { db, store } = read(IDBrequest, CATEGORIES)
        const cursor = store.get('gendercategories')
        cursor.onsuccess = () => {
            const categories = cursor.result.value[gender]
            db.close()
            resolve(categories)
        }
        cursor.onerror = e => { reject(e) }
    })
)

const selectArticlesOfCategoryOfGender = async(gender, category) => open().then(IDBrequest =>
    new Promise(async (resolve, reject) => {

        console.log("Getting", gender, category)

        try {
        
            const { db, store } = read(IDBrequest, CATEGORIES)

            const getCategoryIds = async(category) => new Promise(resolve => {
                if (!category) throw new Error("Category isn't defined")
                const cursor = store.get('category')
                cursor.onsuccess = () => { resolve(cursor.result.value[category]) }
                cursor.onerror = e => { reject(e) }
            })

            const getSexIds = async(gender) => new Promise((resolve, reject) => {
                if (gender) { 
                    const cursor = store.get('sex')
                    cursor.onsuccess = () => { resolve(cursor.result.value[gender]) }
                    cursor.onerror = e => { reject(e) }
                } else { resolve(null) }
            })

            const categoryIds = await getCategoryIds(category)
            const genderIds = await getSexIds(parseGender(gender))

            const ids = genderIds ? [...categoryIds].filter(x => genderIds.has(x)) : [...categoryIds]

            const tx = db.transaction(ARTICLES, "readonly")
            const articles = tx.objectStore(ARTICLES)

            // Convertimos cada key en una promesa
            const promises = ids.map(key => new Promise((resolve, reject) => {
                const req = articles.get(key)
                req.onsuccess = () => resolve(new Article(req.result))
            }))

            // Esperamos a que se obtengan todas
            Promise.all(promises).then(results => {
                db.close()
                resolve(results)
            }).catch(err => {
                db.close()
                console.error('Error obteniendo objetos:', err);
            });

        } catch(e) {
            reject(e)
        }
    })
)

const selectRecent = async() => open().then(IDBrequest => 
    new Promise(async resolve => {
        const articles = []

        const getIds = () => new Promise(resolve => {
            const { db, store } = read(IDBrequest, CATEGORIES)
            const cursor = store.get('recent')
            cursor.onsuccess = () => resolve (cursor.result.value) 
        })

        const ids = [...await getIds()]

        const { db, store } = read(IDBrequest, ARTICLES)
        
        // Convertimos cada key en una promesa
        const promises = ids.map(key => new Promise((resolve, reject) => {
            const req = store.get(key)
            req.onsuccess = () => resolve(new Article(req.result))
        }))

        // Esperamos a que se obtengan todas
        Promise.all(promises).then(results => {
            db.close()
            resolve(results)
        }).catch(err => {
            db.close()
            console.error('Error obteniendo objetos:', err)
        });
    })
)

const selectDiscounts = async() => open().then(IDBrequest => 
    new Promise(async resolve => {
        const articles = []

        const getIds = () => new Promise(resolve => {
            const { db, store } = read(IDBrequest, CATEGORIES)
            const cursor = store.get('discount')
            cursor.onsuccess = () => resolve (cursor.result.value) 
        })

        const ids = [...await getIds()]

        const { db, store } = read(IDBrequest, ARTICLES)
        
        // Convertimos cada key en una promesa
        const promises = ids.map(key => new Promise((resolve, reject) => {
            const req = store.get(key)
            req.onsuccess = () => resolve(new Article(req.result))
            req.onerror = (e) => reject(e)
        }))

        // Esperamos a que se obtengan todas
        Promise.all(promises).then(results => {
            db.close()
            resolve(results)
        }).catch(err => {
            db.close()
            console.error('Error obteniendo objetos:', err)
        });
    })
)

const selectById = async(id) => open().then(IDBrequest => 
    new Promise(async (resolve, reject) => {
        const { db, store } = read(IDBrequest, ARTICLES)
        const cursor = store.get(Number(id))
        cursor.onsuccess = () => {
            const article = cursor.result;
            console.log(article)
            db.close()
            resolve (new Article(article))
        }
        cursor.onerror = e => {
            console.error(e)
            reject(e)
        }
    })
)

const putGender = async(gender) => open().then(IDBrequest => 
    new Promise(async(resolve, reject) => {
        const { db, store } = write(IDBrequest, CATEGORIES)

        const getGenders = () => new Promise(resolve => {
            const cursor = store.get('sex')
            cursor.onsuccess = () => { 
                resolve (cursor.result.value) 
            }
        })

        const genders = await getGenders()

        if (!genders[gender])
            genders[gender] = new Set()

        const updateReq = store.put({ key: "sex", value: genders })
        updateReq.onsuccess = () => { 
            db.close()
            resolve(genders) 
        }
        updateReq.onerror = e => { reject(e) }
    })
)

const putCategoryOfGender = async(gender, category) => open().then(IDBrequest => 
    new Promise(async(resolve, reject) => {
        const { db, store } = write(IDBrequest, CATEGORIES)

        const getStoreObject = () => new Promise(resolve => {
            const cursor = store.get('gendercategories')
            cursor.onsuccess = () => { 
                resolve (cursor.result) 
            }
        })

        const storeObject = await getStoreObject()

        if (!storeObject.categories[gender])
            storeObject.categories[gender] = new Set()

        storeObject.categories[gender].add(category)

        const updateReq = store.put(storeObject)
        updateReq.onsuccess = () => { 
            db.close()
            resolve(genders) 
        }
        updateReq.onerror = e => { reject(e) }
    })
)

export default function() {

    const [ isLoading, setIsLoading ] = useState()

    const request = async(req, ...params) => new Promise(async (resolve, reject) => {
        if (isLoading !== true) try {
            setIsLoading(true)
            const result = await req(...params)
            setIsLoading(false)
            resolve(result)
        } catch(e) { reject(e) }
        finally { setIsLoading(false) }
        else reject("A request already launched")
    })

    return {
        isLoading,
        database: {
            length: () => request(length), // obtener el número de artículos del catálogo
            maxId: () => request(maxId), // obtener el ID más alto del catálogo
            size: () => request(size), // obtener el tamaño total de todas las imágenes del catálogo
            pull: (articles) => request(pull, articles), // obtener los articulos desde la base de datos externa y ponerla en el IndexedDB
            selectAll: () => request(selectAll), // devuelve todos los artículos
            selectById: (id) => request(selectById, id), // devuelve un artículo específico
            selectRecent: () => request(selectRecent), // devuelve los artículos marcados como 'recientes'
            selectDiscounts: () => request(selectDiscounts), // devuelve los artículos que tienen descuento
            selectGenders: () => request(selectGenders), // devuelve los géneros disponibles en el catálogo
            selectCategoriesOfGender: (gender) => request(selectCategoriesOfGender, gender), // devuelve las categorías pertenecientes a un género en el catálogo
            selectArticlesOfCategoryOfGender: (gender, category) => request(selectArticlesOfCategoryOfGender, gender, category), // devuelve los artículos pertenecientes a una categoría perteneciente a un género en el catálogo
            putGender: (gender) => request(putGender, gender),
            putCategoryOfGender: (gender, category) => request(putCategoryOfGender, gender, category) 
        }
    }

}