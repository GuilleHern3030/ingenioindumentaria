interface DataBase extends IDBOpenDBRequest {
    event:Event,
    database:IDBDatabase,
    close: () => void,
    write: (objectStore:string) => IDBOpened,
    read: (objectStore:string) => IDBOpened,
    select: (objectStore:string, filter:Function, order:Order, start:number, limit:number) => Promise<IDBSelection>,
    search: (objectStore:string, objectStoreIndex:ObjectStoreIndex, prompt:string|string[], filter:Function, order:Order, start:number, limit:number) => Promise<IDBSelection>,
    pks: (objectStore:string, filter:Function, order:Order) => Promise<any[]>,
    get: (objectStore:string, key?:any) => Promise<any|any[]>,
    set: (objectStore:string, objects:any[]) => Promise<void>,
    add: (objectStore:string, object:any|any[]) => Promise<void>,
    edit: (objectStore:string, key:any, object:any) => Promise<void>,
    remove: (objectStore:string, object:any) => Promise<void>,
    clear: (objectStore:string) => Promise<void>
}

interface ObjectStoreIndex {
    key: string,
    value: string
}

interface IDBOpened {
    request:IDBDatabase,
    transaction:IDBTransaction,
    store:IDBObjectStore
}

interface OnCreate extends Function {
    database:IDBDatabase,
}

interface Order {
    key:string,
    order:'asc'|'desc'
}

interface IDBSelection {
    objects: any[],
    size: number
}

export const open = async (dbName:string, onCreate?:OnCreate, version?:number) => new Promise<DataBase>((resolve, reject) => {
    const IDBrequest:IDBOpenDBRequest = window.indexedDB.open(dbName, version ?? 1)
    IDBrequest.onupgradeneeded = () => onCreate(IDBrequest.result)
    IDBrequest.onerror = e => reject(e)
    IDBrequest.onsuccess = (event: Event) => {

        IDBrequest["event"] = event
        IDBrequest["database"] = IDBrequest.result
        IDBrequest["close"] = () => IDBrequest.result.close() //event.target.result.close()
        IDBrequest["write"] = (objectStore:string) => dbWrite(IDBrequest.result, objectStore)
        IDBrequest["read"] = (objectStore:string) => dbRead(IDBrequest.result, objectStore)
        IDBrequest["select"] = (objectStore:string, filter:Function = undefined, order:Order = null, start = 0, limit = 0) => dbSelect(IDBrequest.result, objectStore, filter, order, start, limit)
        IDBrequest["search"] = (objectStore:string, objectStoreIndex:ObjectStoreIndex, prompt:string|string[], filter:Function = undefined, order:Order = null, start = 0, limit = 0) => dbSearch(IDBrequest.result, objectStore, objectStoreIndex, prompt, filter, order, start, limit)
        IDBrequest["pks"] = (objectStore:string, filter:Function = undefined, order:Order = null) => dbGetPks(IDBrequest.result, objectStore, filter, order)
        IDBrequest["get"] = (objectStore:string, key?:any) => key ? dbGet(IDBrequest.result, objectStore, key) : dbGetAll(IDBrequest.result, objectStore)
        IDBrequest["set"] = (objectStore:string, objects:any[]) => dbSetAll(IDBrequest.result, objectStore, objects)
        IDBrequest["add"] = (objectStore:string, object:any|any[]) => dbAdd(IDBrequest.result, objectStore, object)
        IDBrequest["edit"] = (objectStore:string, key:any, object:any) => dbEdit(IDBrequest.result, objectStore, key, object)
        IDBrequest["remove"] = (objectStore:string, key:any|any[]) => dbRemove(IDBrequest.result, objectStore, key)
        IDBrequest["clear"] = (objectStore:string) => dbClear(IDBrequest.result, objectStore)
        resolve(IDBrequest as DataBase)

    }
})

const dbRead = (request:IDBDatabase, objectStore:string):IDBOpened => {
    const transaction = request.transaction(objectStore, "readonly")
    const store = transaction.objectStore(objectStore)
    return { request, transaction, store }
}

const dbWrite = (request:IDBDatabase, objectStore:string):IDBOpened => {
    const transaction = request.transaction(objectStore, "readwrite")
    const store = transaction.objectStore(objectStore)
    return { request, transaction, store }
}

const dbSelect = (IDBrequest:IDBDatabase, objectStore:string, filter:Function = () => true, order:Order = null, start = 0, limit = 0) => new Promise<IDBSelection>((resolve) => {
    const { store } = dbRead(IDBrequest, objectStore)

    console.time("idb selection")
    const objects = []
    let n = 0;
    if (order == null) {
        const response = (objects:any[]) => store.count().onsuccess = (e:any) => {
            const size:number = e.target.result
            resolve({ objects, size })
        } 
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                const filterResult = filter(object)
                if (filterResult == true) {
                    n++
                    if (n >= start)
                        objects.push(object)
                    if (limit > 0 && n >= start + limit)
                        response(objects)
                }
                cursor.result.continue()
            } else response(objects)
        })
    } else dbGetAll(IDBrequest, objectStore).then((objs:any[]) => {
        const objectsSorted = sortBy(objs, order.key, order.order)
        objectsSorted.forEach(object => {
            if (!(limit > 0 && n >= start + limit)) {
                const filterResult = filter(object)
                if (filterResult == true) {
                    n++
                    if (n >= start)
                        objects.push(object)
                    if (limit > 0 && n >= start + limit)
                        resolve({ objects, size: objs.length })
                }
            }
        })
        resolve({ objects, size: objs.length })
    })
    console.timeEnd("idb selection")
})

// Obtiene los objetos que cumplan con el criterio de búsqueda por índex
const dbSearch = (IDBrequest:IDBDatabase, objectStore:string, objectStoreIndex:ObjectStoreIndex, prompt:string|string[], filter:Function = () => true, order:Order = null, start = 0, limit = 0) => new Promise<IDBSelection>(async (resolve, reject) => {
    const { store } = dbRead(IDBrequest, objectStore)

    const index = store.index(objectStoreIndex.key)

    console.time("idb search")

    const getResults = (prompt:string) => new Promise<any[]>(async resolve => {
        
        const range = IDBKeyRange.bound(prompt, prompt + "\uffff")
        const request = index.openCursor(range)
        const objects = []

        request.onerror = () => reject(request.error)
        request.onsuccess = (e:any) => {
            const cursor = e.target.result
            if (!cursor) 
                return resolve(objects)
            objects.push(cursor.value)
            cursor.continue()
        }
    })

    const mergeResults = (data: any[][]) => {
        const map = new Map<number, any>()
        data.flat().forEach(article => {
            if (!map.has(article.id)) {
            map.set(article.id, article)
            }
        })
        return Array.from(map.values())
    }

    const applyFilters = (results:any[]):any[] => {
        let n = 0;
        const objects = []
        const objectsSorted = order ? sortBy(results, order.key, order.order) : results
        objectsSorted.forEach((object:any) => {
            if (!(limit > 0 && n >= start + limit)) {
                const filterResult = filter(object)
                if (filterResult == true) {
                    n++
                    if (n >= start)
                        objects.push(object)
                    if (limit > 0 && n >= start + limit)
                        return objects
                }
            }
        })
        return objects
    }

    const results = Array.isArray(prompt) ? 
        mergeResults(await Promise.all(
            prompt.map(async (str:string) => await getResults(str))
        )) : await getResults(prompt)

    const filteredResult = applyFilters(results)

    resolve({ objects: filteredResult, size: filteredResult?.length ?? 0 })

    console.timeEnd("idb search")
})

// Obtiene los PKs según los filtros y el orden definidos
const dbGetPks = (IDBrequest:IDBDatabase, objectStore:string, filter:Function = () => true, order:Order = null) => new Promise<any[]>((resolve, reject) => {
    const { store } = dbRead(IDBrequest, objectStore)

    console.time("idb count")
    const pks = []
    console.log("ORDER TYPE:", order)
    if (order == null) {
        const cursor = store.openCursor()
        cursor.addEventListener('success', () => {
            if (cursor.result) {
                const object = cursor.result.value
                const filterResult = filter(object)
                if (filterResult == true)
                    pks.push(object.id ?? object.slug)
                cursor.result.continue()
            } else resolve(pks)
        })
    } else dbGetAll(IDBrequest, objectStore).then(objs => {
        console.log("OBJECTS TO ORDER:", objs)
        const objectsSorted = sortBy(objs, order.key, order.order)
        console.log("ORDERED OBJECTS:", objectsSorted)
        objectsSorted.forEach(object => {
            const filterResult = filter(object)
            if (filterResult == true)
                pks.push(object.id ?? object.slug)
        })
        resolve(pks)
    })
    console.timeEnd("idb count")
})

// Añade un objeto (si es un array, se añadiran todos)
const dbAdd = (IDBrequest:IDBDatabase, objectStore:string, object:any|any[]) => new Promise<void>((resolve) => {
    if (object) {
        const { transaction, store } = dbWrite(IDBrequest, objectStore)
        if (!Array.isArray(object))
            store.add(object)
        else 
            object.forEach(obj => { store.add(obj) })
        transaction.addEventListener("complete", () => resolve())
    } else resolve()
})

// Elimina un objeto según su key y añade otro en su lugar
const dbEdit = (IDBrequest:IDBDatabase, objectStore:string, key:any, object:any) => new Promise<void>((resolve) => {
    if (object) {
        const { transaction, store } = dbWrite(IDBrequest, objectStore)
        store.delete(key)
        store.add(object)
        transaction.addEventListener("complete", () => resolve())
    } else resolve()
})

// Elimina un objeto con su key (si es un array, se eliminarán todos)
const dbRemove = (IDBrequest:IDBDatabase, objectStore:string, key:any|any[]) => new Promise<void>((resolve) => {
    if (key) {
        const { transaction, store } = dbWrite(IDBrequest, objectStore)
        //if (!Array.isArray(key))
            store.delete(key)
        //else 
            //key.forEach(pk => { store.delete(pk) })
        transaction.addEventListener("complete", () => resolve())
    } else resolve()
})

// Elimina todos los objetos de un ObjectStore
const dbClear = (IDBrequest:IDBDatabase, objectStore:string) => new Promise<void>((resolve) => {
    const { transaction, store } = dbWrite(IDBrequest, objectStore)
    store.clear() // vacía el store
    transaction.addEventListener("complete", () => resolve())
})

// Establece los objetos del store (eliminando los previamente añadidos)
const dbSetAll = (IDBrequest:IDBDatabase, objectStore:string, objects:any[]) => new Promise<void>((resolve, reject) => {
    if (objects) {
        const { transaction, store } = dbWrite(IDBrequest, objectStore)
        store.clear() // vacía el store
        objects.forEach(object => { store.add(object) })
        transaction.addEventListener("complete", () => resolve())
    } else resolve()
})

// Obtener todos los objetos de un store
const dbGetAll = (IDBrequest:IDBDatabase, objectStore:string) => new Promise<any[]>((resolve) => {
    const { store } = dbRead(IDBrequest, objectStore)
    const cursor = store.getAll()
    cursor.onsuccess = () => resolve(cursor.result)
})

// Obtener objeto por key (si key es un array, se obtendrán todos)
const dbGet = (IDBrequest:IDBDatabase, objectStore:string, key:any|any[]) => new Promise<any>(async(resolve, reject) => {
    const { store } = dbRead(IDBrequest, objectStore)

    if (!Array.isArray(key)) {

        const cursor = store.get(key)
        cursor.onsuccess = () => resolve(cursor.result)

    } else { // key array

        console.time("idb selectByPK")

        const promises = key.map(pk =>
            new Promise(resolve => {
                const req = store.get(pk);
                req.onsuccess = () => resolve(req.result);
            })
        )

        const objects = await Promise.all(promises)
        console.timeEnd("idb selectByPK")
        resolve(objects)

    }
})

// Borra una base de datos
export const remove = async (dbName:string) => {
    return new Promise<void>((resolve) => {
        const IDBrequest = window.indexedDB.deleteDatabase(dbName)
        IDBrequest.onsuccess = () => resolve()
        IDBrequest.onerror = () => resolve()
    })
}

// [AUXILIARY FUNCTION] Ordena un array de objetos por una propiedad arbitraria
function sortBy(arr:Array<any>, key:string, order:'asc'|'desc' = 'asc'): Array<any> {
    const sorted = [...arr]

    const price = (article:any) => {
        try {
            const prices = article?.variants?.map(v => v['discount'] > 0 ? v['price'] - v['price'] * v['discount'] / 100 : v['price'])
            const result = Math.min(...prices)
            return (isNaN(result) || !isFinite(result)) ? null : result
        } catch(e) { return null }
    }

    try {

        sorted.sort((a, b) => {

            let A = key == 'price' ? price(a) : a[key];
            let B = key == 'price' ? price(b) : b[key];

            console.log(A)

            // Manejo de undefined/null
            if (A == null) return 1;
            if (B == null) return -1;

            // Si son strings → normalizar
            if (typeof A === 'string') A = A.toLowerCase();
            if (typeof B === 'string') B = B.toLowerCase();

            if (A < B) return order === 'asc' ? -1 : 1;
            if (A > B) return order === 'asc' ? 1 : -1;
            return 0;
        });

    } catch (e) { }

    return sorted;
}