export { default as delete } from "./handlers/articles/deleteArticleHandler.ts";
export { default as get } from "./handlers/articles/getArticlesHandler.ts";
export { default as post } from "./handlers/articles/postArticleHandler.ts";
export { default as put } from "./handlers/articles/putArticleHandler.ts";
// export { default as putAll } from "./handlers/articles/putAllArticlesHandler.ts";

/*export const createArticle = async(article:Article, addedImages=[]) => {
    
            console.log("Uploading ", addedImages)
            const results = await uploadImages(addedImages, article)
            console.log("Upload images result: ", results)

            console.log("Creating article ", article.name())
            const result = await createArticle(article)
            console.log("Creation result: ", result)
}*/