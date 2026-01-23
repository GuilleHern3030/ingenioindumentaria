export default {
    
    set(params:Record<string, any>):string {

        const formatedParams:string[] = []

        for (let param in params) {
            const value = params[param]

            if(typeof(value) === 'string'
            || typeof(value) === 'boolean'
            || !Number.isNaN(Number(value))) // valid number
                formatedParams.push(`${param}=${value ?? ''}`)

            //else console.warn("[Invalid query param]", param, "=", value)
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
    }
}