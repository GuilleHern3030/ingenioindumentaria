import styles from './Product.module.css'
import accept from '../../../../assets/icons/accept.png'
import cancel from '../../../../assets/icons/cancel.png'
import remove from '../../../../assets/icons/delete.png'
import { Article } from '../../../../api/objects/Article.ts'
import { useState } from 'react'

const indexOf = (images, src) => {
    for (let index = 0; index < images.length; index++) {
        if (images[index].src === src) {
            return index;
        }
    }
}

export default function({article, onAccept, onCancel, onDelete, id}) {

    const [ name, setName ] = useState(article ? article.name() : "")
    const [ category, setCategory ] = useState(article ? article.category() : "")
    const [ description, setDescription ] = useState(article ? article.description() : "")
    const [ price, setPrice ] = useState(article ? article.price() : 0)
    const [ discount, setDiscount ] = useState(article ? article.discount() : 0)
    const [ sizes, setSizes ] = useState(article ? article.sizes() : "")
    const [ inStock, setInStock ] = useState(article ? article.inStock() : true)
    const [ date, setDate ] = useState(article ? article.date().date : "")
    const [ time, setTime ] = useState(article ? article.date().time : "")
    const [ inStockEver, setInStockEver ] = useState(article ? article.inStock() === true : true)
    
    const [ images, setImages ] = useState(article ? article.images() : [])

    const [ addedImages, setAddedImages ] = useState([])
    const [ removedImages, setRemovedImages ] = useState([])

    const [ warning, setWarning ] = useState()

    const handleOnIntegerInputChange = (event, setter) => {
        if (isNaN(Number(event.target.value)) || Number(event.target.value) <= 0)
            setter(0)
        else setter(event.target.value)
    }

    const removeImage = src => {
        const index = indexOf(images, src)
        const image = article.getImage(index)
        setRemovedImages(images => {
            const newImages = images.slice()
            newImages.push(image)
            return newImages
        })

        /*setImages(images => {
            const newList = images.slice()
            const index = indexOf(images, src)
            if (index != undefined) {
                newList[index]['deleted'] = true
                if (newList[index]['file'] != undefined)
                    newList.splice(index, 1)
            }
            return newList
        })*/
    }

    const removeAddedImage = src => {
        setAddedImages(images => {
            const newList = images.slice()
            const index = indexOf(images, src)
            if (index !== undefined) 
                newList.splice(index, 1)
            return newList
        })
    }

    const handleUploadImage = async e => {
        const file = e.target.files[0]
        if (!file) return;
        const formData = new FormData()
        formData.append('image', file)
        const imageObject = {
            size: file.size,
            src: URL.createObjectURL(file),
            file: file,
            formData: formData
        }
        setAddedImages(images => {
            const newImages = images.slice()
            newImages.push(imageObject)
            return newImages
        })
    }

    const handleOnSuccess = accepted => {

        try {

            if (accepted === false)
                return onCancel()
            
            const getDate = () => { // "YYYY-MM-DDThh:mm:ss.mmmZ"
                const date = document.getElementById("date").getAttribute("value")
                const time = document.getElementById("time").getAttribute("value")
                return (date.length > 0) ? 
                    date + 'T' + time + ":00.000Z" :
                    new Date().toISOString()
            }

            const getInStock = () => {
                if (inStockEver === true) return "Inf"
                else if (isNaN(Number(document.getElementById("InStock").getAttribute("value")))) return ""
                else return document.getElementById("InStock").getAttribute("value")
            }

            const getSex = () => {
                try { return document.querySelector('input[name="Sex"]:checked').value } 
                catch(e) { return "U" }
            }

            const json = {
                "ID": id,
                "Name": document.getElementById("Name").getAttribute("value"),
                "Category": document.getElementById("Category").getAttribute("value"),
                "Description": document.getElementById("Description").textContent,
                "Discount": Number(document.getElementById("Discount").getAttribute("value")),
                "Price": Number(document.getElementById("Price").getAttribute("value")),
                "Sizes": document.getElementById("Sizes").getAttribute("value"),
                "Recent": document.querySelector('input[name="Recent"]:checked') !== null ? "T" : "",
                "Sex": getSex(),
                "InStock": getInStock(),
                "ImageSrc": article ? article.stringifyImages() : "",
                "Date": getDate(),
            }

            onAccept(new Article(json), addedImages, removedImages)

        } catch(e) {
            console.warn(e)
            setWarning("Debes completar todos los campos para finalizar")
        }
    }
    
    try {

        return <div className={styles.productdetailed}>

            <div className={styles.removecontainer}>
                { article ? <img className={styles.button} src={remove} onClick={() => onDelete(article)}/> : <></> }
            </div>

            <div className={styles.productdata}>

                <>

                    <div className={styles.input}>
                        <p>Nombre</p>
                        <input id='Name' required='' placeholder='Nombre' value={name} onChange={e => setName(e.target.value)}/>
                    </div>

                    <div className={styles.input}>
                        <p>Categoria</p>
                        <input id='Category' required='' placeholder='Categoria' value={category} onChange={e => setCategory(e.target.value)}/>
                    </div>

                    <div className={styles.input}>
                        <p>Descripcion</p>
                        <textarea className={styles.textarea} id='Description' required='' type='multiline' placeholder='Descripcion' value={description} onChange={e => setDescription(e.target.value)}/>
                    </div>

                    <div className={styles.input}>
                        <p>Precio</p>
                        <input id='Price' type='number' placeholder='Precio' value={price} min='0' onChange={e => handleOnIntegerInputChange(e, setPrice)}/>
                    </div>

                    <div className={styles.input}>
                        <p>Descuento</p>
                        <input id='Discount' type='number' placeholder='Descuento' value={discount} min='0' max='100' onChange={e => handleOnIntegerInputChange(e, setDiscount)}/>
                        <p>%</p>
                    </div>

                    <div className={styles.input}>
                        <p>Reciente</p>
                        <input id='Recent' name='Recent' type='checkbox' defaultChecked={article ? article.recent() : true}/>
                    </div>

                    <div className={styles.input}>
                        <p>Sexo</p>
                        <label>M</label>
                        <input className={styles.sex} id='Sex-M' type='radio' name='Sex' defaultChecked={article ? article.sex() === 'M' : false} value='M'/>
                        <label>F</label>
                        <input className={styles.sex} id='Sex-F' type='radio' name='Sex' defaultChecked={article ? article.sex() === 'F' : false} value='F'/>
                        <label>U</label>
                        <input className={styles.sex} id='Sex-U' type='radio' name='Sex' defaultChecked={article ? article.sex() === 'U' : true } value='U'/>
                    </div>

                    <div className={styles.input}>
                        <p>{`Tallas (separadas por comas)`}</p>
                        <input id='Sizes' value={sizes} placeholder='XS,S,M,L,XL,XXL' onChange={e => setSizes(e.target.value)}/>
                    </div>

                    <div className={styles.input}>
                        <p>En stock</p>
                        <label style={{paddingRight:'.5em'}}>{`(Siempre?`}</label>
                        <input type='checkbox' defaultChecked={inStockEver} onChange={() => setInStockEver(stock => !stock)}/>
                        <label>{')'}</label>
                        { inStockEver === false ? 
                            <input id='InStock' type='number' min='0' value={inStock} style={{marginLeft:'1em'}} onChange={e => handleOnIntegerInputChange(e, setInStock)} /> : <></>
                        }
                    </div>

                    <div className={styles.input}>
                        <p>Fecha</p>
                        <input id='date' type='date' value={date} onChange={e => setDate(e.target.value)}/>
                        <input id='time' type='time' value={time} onChange={e => setTime(e.target.value)}/>
                    </div>
                </>

                { images.length > 0 ?
                    <div className={styles.imagesdetailed}>
                        { images.filter(img => indexOf(removedImages, img.src) === undefined /*img['deleted'] != true*/).length > 0 ? <p style={{marginTop:'1em', marginBottom:'1em'}}>Imágenes:</p> : <></> }
                        {
                            images
                                .filter(img => indexOf(removedImages, img.src) === undefined)
                                .map((img, index) => <div key={index} className={styles.imagedetailedcontainer}>
                                <img src={img.src} className={styles.imagedetailed}></img>
                                { isNaN(Number(img.size / 1024).toFixed(0)) ? <></> : <p>{Number(img.size / 1024).toFixed(0)} KB</p> }
                                <img src={remove} className={styles.button} onClick={() => removeImage(img.src)}/>
                            </div>)
                        }
                    </div>
                : <></>}
                { addedImages.length > 0 ? <div className={styles.imagesadded}>
                    <p style={{marginTop:'1em', marginBottom:'1em'}}>Imágenes a agregar:</p>
                    {
                        addedImages.map((img, index) => <div key={index} className={styles.imagedetailedcontainer}>
                            <img src={img.src} className={styles.imagedetailed}></img>
                            { isNaN(Number(img.size / 1024).toFixed(0)) ? <></> : <p>{Number(img.size / 1024).toFixed(0)} KB</p> }
                            <img src={remove} className={styles.button} onClick={() => removeAddedImage(img.src)}/>
                        </div>)
                    }
                </div> : <></> } 

                <div style={{marginBottom:'2em'}}>
                    <p className={styles.addimagetext}>Añadir nueva imagen</p>
                    <input type='file' onChange={handleUploadImage}/>
                </div>

                { warning ? 
                    <div className={styles.buttons}>
                        <p className={styles.warning}>{warning}</p>
                    </div> : <></>
                }

                <div className={styles.buttons}>
                    <img src={cancel} className={styles.button} onClick={() => handleOnSuccess(false)}/>
                    <img src={accept} className={styles.button} onClick={() => handleOnSuccess(true)}/>
                </div>


            </div>
        </div>
    } catch(e) {
        console.error("Once product has an error", e)
        return null
    }
}