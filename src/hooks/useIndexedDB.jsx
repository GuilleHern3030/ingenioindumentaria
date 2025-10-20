import { useState } from "react"
import { get as getArticles } from "../api/articles.ts"
import { Article } from "../api/objects/Article.ts"

const DATA_BASE = "IngenioIndumentaria"
const ARTICLES = "Articles" // Todos los articulos disponibles
const CATEGORIES = "Categories" // Nombre de las categorias

const dbOpen = async() => new Promise((resolve, reject) => {
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

const dbDelete = async() => {
    return new Promise(resolve => {
        const IDBrequest = window.indexedDB.deleteDatabase(DATA_BASE)
        IDBrequest.onerror = () => resolve()
        IDBrequest.onsuccess = () => resolve()
    })
}

const dbPut = async(articles) => {
    if (articles == undefined) throw new Error("Articles is not defined") 
    if (!Array.isArray(articles)) throw new Error("Articles is not an Array") 
    
    const addArticles = async(IDBrequest, articles) => {
        return new Promise(resolve => {
            const IDBtransaction = IDBrequest.result.transaction(ARTICLES, "readwrite")
            const objectStore = IDBtransaction.objectStore(ARTICLES)
            articles.forEach(article => {
                objectStore.add(article.json())
            })
            IDBtransaction.addEventListener("complete", () => resolve())
        })
    }

    const addCategories = async(IDBrequest, articles) => {
        const categories = new Set()
        const categoriesId = { }
        const recentlyId = [ ]
        articles.forEach(article => {
            const category = article.category()
            const id = article.id()
            categories.add(category)
            if (categoriesId[category] == undefined)
                categoriesId[category] = [id]
            else categoriesId[category].push(id)
            if (article.recent())
                recentlyId.push(id)
        })
        return new Promise(resolve => {
            const IDBtransaction = IDBrequest.result.transaction(CATEGORIES, "readwrite")
            const objectStore = IDBtransaction.objectStore(CATEGORIES)
            objectStore.add({ key: "recent", "recent": recentlyId})
            objectStore.add({ key: "categories", "categories": categories})
            objectStore.add({ key: "index", "index": categoriesId})
            resolve()
        })
    }

    return await dbOpen().then(async IDBrequest => {
        const addAllArticles = async() => {
            await addArticles(IDBrequest, articles)
            await addCategories(IDBrequest, articles)
            IDBrequest.close()
            return articles
        }
        return await addAllArticles()
    })
}

const dbLength = async() => dbOpen().then(IDBrequest => 
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

const dbMaxId = async() => dbOpen().then(IDBrequest => 
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

const dbHasContent = async() => dbOpen().then(IDBrequest => 
    new Promise(resolve => {
        const db = IDBrequest.event.target.result
        const tx = db.transaction(ARTICLES, "readonly");
        const store = tx.objectStore(ARTICLES);
        const countRequest = store.count();
        countRequest.onsuccess = () => {
            const count = countRequest.result;
            db.close()
            resolve(count > 0);
        };
        countRequest.onerror = () => resolve(false);
    })
)

export const dbPull = async(articles) => new Promise(async resolve => {
    try {
        const objectStore = (articles != undefined) ? articles :
            await getArticles()

        await dbDelete()
        await dbPut(objectStore)

        resolve(objectStore)
    } catch(e) {
        console.error(e)
        resolve(null)
    }
})

const dbSelectByCategory = async(category) => dbOpen().then(IDBrequest => 
    new Promise(resolve => {
        const articles = []
        const db = IDBrequest.event.target.result
        const tx = db.transaction(ARTICLES, "readonly")
        const store = tx.objectStore(ARTICLES)
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                if (object['Category'] === category)
                    articles.push(new Article(object))
                cursor.result.continue()
            } else { // All objects were readed
                db.close()
                resolve(articles)
            }
        })
    })
)

const dbSelectCategories = async() => dbOpen().then(IDBrequest => 
    new Promise(resolve => {
        const categories = []
        const db = IDBrequest.event.target.result
        const tx = db.transaction(CATEGORIES, "readonly")
        const store = tx.objectStore(CATEGORIES)
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const category = cursor.result.value
                categories.push(category)
                cursor.result.continue()
            } else { // All objects were readed
                db.close()
                const array = []
                const setOfCategories = categories[0].categories
                setOfCategories.forEach(category => array.push(category))
                resolve(array)
            }
        })
    })
)

const dbSelectRecent = async() => dbOpen().then(IDBrequest => 
    new Promise(resolve => {
        const articles = []
        const db = IDBrequest.event.target.result
        const tx = db.transaction(ARTICLES, "readonly")
        const store = tx.objectStore(ARTICLES)
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                if (object['recent']) 
                    articles.push(new Article(object))
                cursor.result.continue()
            } else { // All objects were readed
                db.close()
                resolve(articles)
            }
        })
    })
)

const dbSelectAll = async() => dbOpen().then(IDBrequest => 
    new Promise(resolve => {
        const articles = []
        const db = IDBrequest.event.target.result
        const tx = db.transaction(ARTICLES, "readonly")
        const store = tx.objectStore(ARTICLES)
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

export const dbSize = async() => dbOpen().then(IDBrequest => 
    new Promise(resolve => {
        let size = 0
        const db = IDBrequest.event.target.result
        const tx = db.transaction(ARTICLES, "readonly")
        const store = tx.objectStore(ARTICLES)
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

    const pull = articles => request(dbPull, articles)
    const selectCategories = () => request(dbSelectCategories)
    const selectByCategory = category => request(dbSelectByCategory, category)
    const selectRecent = () => request(dbSelectRecent)
    const selectAll = () => request(dbSelectAll)

    return {
        isLoading,
        database: {
            length: dbLength,
            maxId: dbMaxId,
            size: dbSize,
            pull, // obtener los articulos desde la base de datos externa
            selectByCategory, // devuelve los artículos de una determinada categoría
            selectCategories, // devuelve las categorias existentes
            selectRecent, // devuelve los artículos marcados como 'recientes'
            selectAll, // devuelve todos los artículos
        }
    }

}

