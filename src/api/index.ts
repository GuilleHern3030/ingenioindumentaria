import Article from "./objects/Article.ts"
import gendersJson from "./models/genders.json"

import { get } from "./articles"
export const getArticles = () => get()

import { post as postArticle, put as putArticle, delete as removeArticle } from './articles.ts'
import { deleteAll as deleteImages, uploadAll as uploadImages } from './images.ts'

export const deleteArticle = async(article:Article) => {

    console.log("Removing: ", article)

    console.log("Removing images ", article.images())
    const results = await deleteImages(article.images(), article)
    console.log("Remove images result: ", results)

    console.log("Removing article ", article.name())
    const result = removeArticle(article)
    console.log("Remove result: ", result)

}

export const editArticle = async(article:Article, addedImages=[], removedImages=[]) => {

    //console.log("Editing: ", article)

    if (addedImages.length > 0) {
        //console.log("Uploading ", addedImages)
        const results = await uploadImages(addedImages, article)
        //console.log("Upload images result: ", results)
    }

    if (removedImages.length > 0) {
        //console.log("Removing ", removedImages)
        const results = await deleteImages(removedImages, article)
        //console.log("Remove images result: ", results)
    }

    //console.log("Editing article ", article)
    const result = await putArticle(article)
    //console.log("Edition result: ", result)
}

export const createArticle = async(article:Article, addedImages=[]) => {

    console.log("Creating: ", article)

    console.log("Uploading ", addedImages)
    const results = await uploadImages(addedImages, article)
    console.log("Upload images result: ", results)

    console.log("Creating article ", article.name())
    const result = await postArticle(article)
    console.log("Creation result: ", result)

}

export const genders = gendersJson

export default Article