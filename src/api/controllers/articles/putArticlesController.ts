import putArticle from './putArticleController.ts'

export const putArticles = async(articles:Array<any>) => {

    return articles.map(async article => {
        try {
            return await putArticle(article)
        } catch(e) {
            return e
        }
    })

}

export default putArticles




/*
export const putArticles = async(oldArticles:Array<Article>, newArticles:Array<Article>) => {
    if (!Array.isArray(oldArticles) || !Array.isArray(newArticles)) throw new Error("Is not an array")
    if (newArticles.length == 0) return true;
    const json = await processArticles(oldArticles.slice(), newArticles.slice())
    const { data } = await axios.put(endpoint, json, { headers: { token: getLocalToken(), user: getLocalUser() } }
    )
    return data;
}

const processArticles = async(oldArticles:Array<Article>, newArticles:Array<Article>) => {
    const json:any = await mergeArticles(oldArticles, newArticles)
        .then(articlesMerged => checkImagesSize(articlesMerged))
        .then(articlesMerged => discardRemovedArticles(articlesMerged))
        .then(articles => discardArticlesImages(articles))
        .then(articles => uploadNewArticlesImages(articles))
        .then(articles => parseJson(articles))
    return json
}

const mergeArticles = (oldArticles:Array<Article>, newArticles:Array<Article>): Promise<Array<Article>> => new Promise(resolve => {

    const mergedArticles:Array<Article> = []
    for (let i = 0; i < oldArticles.length; i++) {
        const article = oldArticles[i]
        const index = indexOf(article.id(), newArticles)
        if (index >= 0) {
            mergedArticles.push(newArticles[index])
            newArticles.splice(index, 1)
        } else mergedArticles.push(article)
    }

    if (newArticles.length > 0) 
        for (let i = 0; i < newArticles.length; i++) 
            mergedArticles.push(newArticles[i])

    console.log("Merged articles: ", mergeArticles)
    resolve(mergedArticles)

})

const checkImagesSize = async (articles:Array<Article>): Promise<Array<Article>> => new Promise(resolve => {
    
    let size = 0;
    try {
        articles.forEach(article => {
            const images = article.img(undefined).filter(img => img.deleted == undefined)
            images.forEach(img => {
                size += img.size
            })
        })
    } catch(e) {
        console.error(e)
    } finally {
        console.log("Images size: ", size)
        if (size > maxImagesSize) throw new Error("Alcanzaste el máximo tamaño de imágenes. Elimina algunas para proceder.")
    }

    resolve(articles)
})

const discardRemovedArticles = async (allArticles:Array<Article>): Promise<Array<Article>> => new Promise(resolve => {
    const articles:Array<Article> = []
    const articlesRemoved:Array<Article> = []

    allArticles.forEach(article => {
        if (article.isRemoved()) articlesRemoved.push(article)
        else articles.push(article)
    })

    articlesRemoved.forEach(async article => {
        await removeImages(article.img(undefined))
    })

    console.log("Removed articles: ", articlesRemoved)
    console.log("Articles now: ", articles)
    resolve(articles)

})

const discardArticlesImages = async(articles:Array<Article>): Promise<Array<Article>> => new Promise(async resolve => {
    articles.forEach(async(article:Article) => {
        const deletedImages:Array<any> = []
        const images:Array<any> = []
        article.img(undefined).forEach((img:any) => {
            if (img.deleted === true)
                deletedImages.push(img)
            else images.push(img)
        })
        article.setImg(images)
        await removeImages(deletedImages)
    })

    console.log("Images removed")
    resolve(articles)
})

const uploadNewArticlesImages = async(articles:Array<Article>): Promise<Array<Article>> => new Promise(async resolve => {
    articles.forEach(async(article:Article) => {
        const images:Array<any> = []
        article.img(undefined).forEach(async ImageSrc => {
            if (ImageSrc.deleted == undefined && ImageSrc.file != undefined) {
                const src = await pushImage(ImageSrc)
                images.push({
                    size: ImageSrc.size,
                    src
                })
            } 
            else if(ImageSrc.deleted == undefined) 
                images.push(ImageSrc)
        })
        article.setImg(images)
    })
    console.log("Images uploaded")
    resolve(articles)
})

const parseJson = (articles:Array<Article>) => {
    const json:any = articles.map(article => {
        const object = article.json()
        //object.ImageSrc = Array.isArray(object.ImageSrc) ? parseImage(object.ImageSrc) : object.ImageSrc
        return object
    })
    console.log("JSON final: ", json)
    return json;
}

// Accesories functions
const parseImage = (images:Array<any>):string => 
    images.map(image => {
        const src = image.src
        const size = image.size
        if (size == undefined || isNaN(size) || typeof(size) === 'string')
            return [ src, 0 ].join("¬")
        else return [ src, size ].join("¬")
    }).join(",")


const pushImage = async(image:any) => {
    try {
        const src = await uploadImage(image)
        return src;
    } 
    catch(e) { console.error(e) }
}

const removeImages = async(images:Array<any>) => {
    try {
        images.forEach(async (img:any) => {
            if (!img.file)
                await removeImage(img)
        })
    } catch(e) { console.error(e) }
}

const indexOf = (id:number, articles:Array<any>) => {
    for (let index = 0; index < articles.length; index++) {
        if (Number(articles[index].id()) == Number(id)) {
            return index;
        }
    } return -1
}*/