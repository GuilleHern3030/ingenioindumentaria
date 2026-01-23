export const ORDERS = [
    { id: 0, key: "by_default" },
    { id: 1, key: "price", order: "asc" },
    { id: 2, key: "price", order: "desc" },
    { id: 3, key: "discount", order: "asc" },
    { id: 4, key: "discount", order: "desc" },
]

export default {
    get(id:number) {
        return ORDERS[id] ?? ORDERS[0]
    }
}