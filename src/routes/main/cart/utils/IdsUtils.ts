export default {

    parse(params:string) {
        return params.split('-').map(param => {
            const match = param.match(/^(\d+)(.+)$/)
            if (!match) return null;
            return {
                quantity: Number(match[1]),
                id: match[2]
            }
        })

    }

}