import Article, { get as getArticles } from "./articles.ts"
import genders from './models/genders.json'

const DATA_BASE = "IngenioIndumentariaOld"
const ARTICLES = "Articles" // Todos los articulos disponibles
const CATEGORIES = "Categories" // Nombre de las categorias
const SHOPPING_CART = "Cart" // Artículos en el carrito

const open = async() => new Promise((resolve, reject) => {
    const IDBrequest = window.indexedDB.open(DATA_BASE, 1)
    IDBrequest.onupgradeneeded = () => {
        const db = IDBrequest.result
        db.createObjectStore(ARTICLES, { keyPath: "ID" } /*{ autoIncrement: true }*/)
        db.createObjectStore(CATEGORIES, { keyPath: "key" })
        db.createObjectStore(SHOPPING_CART, { keyPath: "ID" })
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

export const pull = async(articles) => new Promise(async (resolve, reject) => {
    try {
        const objectStore = (articles != undefined) ? articles :
            await getArticles()

        await clear()
        await putAll(objectStore)

        const indexs = await getIndex()

        resolve({ articles: objectStore, index: indexs })

    } catch(e) {
        reject(e)
    }
})

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

const putAll = async(articles) => {
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
        const promotionId = new Set() // Recientes
        articles.forEach(article => {
            const id = article.id()
            add(categoriesId, article.category(), id)
            article.sex().forEach(sex => { 
                add(sexId, sex, id) 
                add(sexCategories, sex, article.category())
            })
            article.sizes().forEach(size => { add(sizesId, size, id) })
            if (article.recent() === true) recentId.add(id)
            if (article.discount() > 0 === true) promotionId.add(id)
        })
        return new Promise(resolve => {
            const { transaction, store } = write(IDBrequest, CATEGORIES)
            store.add({ key: "recent", value: recentId})
            store.add({ key: "promotion", value: promotionId})
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

            if (categoryIds) {

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
                
            } else {
                db.close()
                resolve([])
            }

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
            const cursor = store.get('promotion')
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

const selectById = async(id) => open().then(async IDBrequest => {
    const { db, store } = read(IDBrequest, ARTICLES)
    const article = await getStoreObject(store, Number(id))
    db.close()
    return new Article(article)
})

const putGender = async(gender) => open().then(async IDBrequest => {
    const { db, store } = write(IDBrequest, CATEGORIES)
    const storeObject = await getStoreObject(store, 'sex')
    const genders = storeObject.value
    const genderKey = parseGender(gender)

    if (!genders[genderKey])
        genders[genderKey] = new Set()

    await updateStoreObject(store, storeObject)

    db.close()

    return genders 
})

const putCategoryOfGender = async(gender, category) => open().then(async IDBrequest => {
    const { db, store } = write(IDBrequest, CATEGORIES)
    const storeObject = await getStoreObject(store, 'gendercategories')

    if (!storeObject.value[gender])
        storeObject.value[gender] = new Set()

    storeObject.value[gender].add(category)

    await updateStoreObject(store, storeObject)

    db.close()

    return true
})

export default {
        size,
        length,
        maxId,
        pull,
        selectAll,
        selectGenders,
        selectCategoriesOfGender,
        selectArticlesOfCategoryOfGender,
        selectRecent,
        selectDiscounts,
        selectById,
        putGender,
        putCategoryOfGender,
        /*addArticleToCart,
        removeArticleFromCart,
        selectArticlesFromCart,
        selectArticleFromCart,*/
}