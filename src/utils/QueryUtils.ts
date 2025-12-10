export default {
    set(params:Record<string, any>):string {

        const formatedParams:string[] = []

        for (let param in params) {
            const value = params[param]

            if(typeof(value) === 'string'
            || typeof(value) === 'boolean'
            || !Number.isNaN(Number(value))) // valid number
                formatedParams.push(`${param}=${value ?? ''}`)

            else console.warn("[Invalid query param]", param, "=", value)
        }

        return formatedParams.length > 0 ? 
            '?' + formatedParams.join('&')
            : ''
    },
    stringify(obj:Record<string, string>):string {
        const params = []
        Object.entries(obj).forEach(([key, value]) => {
            params.push(`${key}=${value ?? ''}`)
        })
        return params.length > 0 ? 
            '?' + params.join('&')
            : ''
    },
    /*parse(query:string):Record<string, string> { // query = "?param1=value1&param2=value2..."
        let queryParams = {}
        if (query?.length > 0) {
            const params = query.substring(1).split('&')
            params.forEach(param => {

            })
        }
    }*/
}