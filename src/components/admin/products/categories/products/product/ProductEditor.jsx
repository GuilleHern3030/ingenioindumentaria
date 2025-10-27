import { useState } from 'react'
import remove from '../../../../../../assets/icons/delete.webp'
import styles from './Product.module.css'

import Dialog from '../../../../../dialog/Dialog'
import Loading from '../../../../../loading/FullLoading'

import Article, { createArticle, editArticle, deleteArticle } from '../../../../../../api/articles.ts'

import useIndexedDB from '../../../../../../hooks/useIndexedDB.jsx'
import useArticleFilter from '../../../../../../hooks/useArticleFilter.jsx'

const indexOf = (images, src) => {
    for (let index = 0; index < images.length; index++) {
        if (images[index].src === src) {
            return index;
        }
    }
}

export default ({ article, id, gender, category }) => {

    const { setGenderSelected, setCategorySelected } = useArticleFilter()
    const { database } = useIndexedDB()

    const [ name, setName ] = useState(article ? article.name() : "")
    const [ description, setDescription ] = useState(article ? article.description() : "")
    const [ discount, setDiscount ] = useState(article ? article.discount() : 0)
    const [ price, setPrice ] = useState(article ? article.price() : 0)
    const [ sex, setSex ] = useState(article ? article.sex() : [gender])
    const [ sizes, setSizes ] = useState(article ? article.sizes() : [])
    const [ isRecent, setIsRecent ] = useState(article ? article.recent() : true)
    const [ inStock, setInStock ] = useState(article ? article.inStock() : ['Inf'])
    const [ day, setDay ] = useState(article ? article.date().day : new Date().getDate())
    const [ month, setMonth ] = useState(article ? article.date().month : new Date().getMonth())
    const [ year, setYear ] = useState(article ? article.date().year : new Date().getFullYear())
    const [ images, _ ] = useState(article ? article.images() : "")
    const [ addedImages, setAddedImages ] = useState([])
    const [ removedImages, setRemovedImages ] = useState([])

    const [ warning, setWarning ] = useState()

    const [ dialog, setDialog ] = useState()

    const [ isSaving, setIsSaving ] = useState()

    const setStock = (index, stocked) => {
        setInStock(stock => {
            const newInStock = stock.slice()
            newInStock[index] = (stocked === 'Inf') ? true : stocked
            return newInStock
        })
    }

    const setSize = (index, size) => {
        setSizes(sizes => {
            const newSizes = sizes.slice()
            newSizes[index] = size
            return newSizes
        })
    }

    const addSize = () => {
        setSizes(sizes => {
            const newSizes = sizes.slice()
            newSizes.push('')
            return newSizes
        })
        setInStock(inStocks => {
            const newInStocks = inStocks.slice()
            newInStocks.push('Inf')
            return newInStocks
        })
    }

    const removeImage = (src, confirmed) => {

        if (!confirmed) {
            setDialog(<Dialog
                title={"¿Deseas borrar la imagen?"}
                onAccept={() => removeImage(src, true)}
                onReject={() => setDialog(undefined)}
            />)
            return;
        } else setDialog(undefined)

        const index = indexOf(images, src)
        const image = article.getImage(index)
        setRemovedImages(images => {
            const newImages = images.slice()
            newImages.push(image)
            return newImages
        })
    }

    const removeAddedImage = (src, confirmed) => {

        if (!confirmed) {
            setDialog(<Dialog
                title={"¿Deseas borrar la imagen?"}
                onAccept={() => removeAddedImage(src, true)}
                onReject={() => setDialog(undefined)}
            />)
            return;
        } else setDialog(undefined)

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

    const handleDelete = confirmed => {
        if (!confirmed) {
            setDialog(<Dialog
                title={"¿Deseas borrar el artículo?"}
                onAccept={() => handleDelete(true)}
                onReject={() => setDialog(undefined)}
            />)
            return;
        } else setDialog(undefined)

        deleteArticle(article)
        .then(article => database.pull())
        .then(article => {
            alert("Archivo borrado")
            setCategorySelected(undefined)
            setGenderSelected(undefined)
            setIsSaving(undefined)
        })
        .catch(e => { 
            setWarning(e)
            console.error(e) 
            setIsSaving(undefined)
        })

    }
    
    const handleSave = (confirmed) => {

        try {
            
            if (!confirmed) {
                setWarning()
                if (name.length > 0) {
                    if (price == 0) {
                        setDialog(<Dialog title={"¿Deseas guardar el artículo?"} onAccept={() => handleSave(true)} onReject={() => setDialog(undefined)} />)
                    } else setWarning("El precio no puede ser cero")
                } else setWarning("El nombre no puede estar vacío")
                return;
            } else setDialog(undefined)

            const getDate = () => { // "YYYY-MM-DDThh:mm:ss.mmmZ"
                return `${year}-${month.length == 0 ? "01" : month.length == 1 ? `0${month}` : month}-${day.length == 0 ? "01" : day.length == 1 ? `0${day}` : day}T00:00:00.000Z`
            }

            const sizesToDiscard = []
            sizes.forEach((size, index) => {
                if (size.length === 0)
                    sizesToDiscard.push(index)
            })

            setSizes(sizes => sizes.filter((_, index) => sizesToDiscard.includes(index) === false))
            setInStock(inStock => inStock.filter((_, index) => sizesToDiscard.includes(index) === false))

            const articleEdited = new Article({
                ID: parseInt(id, 10),
                Name: name,
                Category: category,
                Description: description,
                Price: price,
                Discount: discount,
                Sizes: sizes.join(","),
                Sex: sex.join(","),
                Recent: isRecent === true ? 'T' : '',
                InStock: inStock.join(","),
                ImageSrc: article ? article.stringifyImages() : "",
                Date: getDate()
            })

            console.log(articleEdited)

            setIsSaving(<Loading/>)

            if (!article)
                createArticleRequest(articleEdited, addedImages)
            else 
                editArticleRequest(articleEdited, addedImages, removedImages)
                
        } catch(e) {
            console.log(e) 
            setWarning("Debes completar todos los campos")
        }
    }

    const createArticleRequest = (newArticle, addedImages) => {
        createArticle(newArticle, addedImages)
        .then(article => database.pull())
        .then(() => {
            alert("Archivo guardado")
            setCategorySelected(undefined)
            setGenderSelected(undefined)
            setIsSaving(undefined)
        })
        .catch(e => { 
            setWarning(e)
            console.error(e)
            setIsSaving(undefined) 
        })
    }

    const editArticleRequest = (articleEdited, addedImages, removedImages) => {
        editArticle(articleEdited, addedImages, removedImages)
        .then(article => database.pull())
        .then(article => {
            alert("Archivo guardado")
            setIsSaving(undefined)
            setCategorySelected(undefined)
            setGenderSelected(undefined)
        })
        .catch(e => { 
            setWarning(e)
            console.error(e) 
            setIsSaving(undefined) 
        })
    }

    try {

        const images = article ? article.images() : []

        return <div id={id} className={`${styles.product} ${styles.producteditor}`}>

            { dialog ? dialog : <></> }
            { isSaving ? isSaving : <></> }

            <div className={styles.productdata}>
                
                <p>Artículo {id}</p>
                <br/>

                <div className={styles.productdataeditable}>
                    <p>Nombre:</p>
                    <input 
                        className={styles.inputText}
                        onChange={e => setName(e.target.value)}
                        defaultValue={name}
                    />
                </div>

                <div className={styles.productdataeditable}>
                    <p>Descripción:</p>
                    <textarea 
                        className={styles.inputText}
                        onChange={e => setDescription(e.target.value)}
                        defaultValue={description}
                    />
                </div>

                <div className={styles.productdataeditable}>
                    <p>Precio:</p>
                    <input 
                        type='number'
                        min={0}
                        className={styles.inputText}
                        onChange={e => setPrice(e.target.value)}
                        defaultValue={price}
                    />
                    <p>$</p>
                </div>

                <div className={styles.productdataeditable}>
                    <p>Descuento:</p>
                    <input 
                        type='number'
                        min={0}
                        className={styles.inputText}
                        onChange={e => setDiscount(e.target.value)}
                        defaultValue={discount}
                    />
                    <p>%</p>
                </div>

                <div className={styles.productdataeditable}>
                    <p>Precio final: <i>${Number(price - (price * discount / 100))}</i></p>
                </div>

                <br/>
                { sex.includes('Y') ? <></> : 
                    <div>
                        <p>Sexo:</p>
                        <div>
                            <label className={styles.sex}>M</label>
                            <input id='Sex-M' type='radio' name='Sex' defaultChecked={article ? sex.includes('M') || sex.includes('B') : false} value='M' onChange={e => setSex((gender === 'B' || gender === 'G') ? ['B'] : ['M'])}/>
                            <label className={styles.sex}>F</label>
                            <input id='Sex-F' type='radio' name='Sex' defaultChecked={article ? sex.includes('F') || sex.includes('G') : false} value='F' onChange={e => setSex((gender === 'B' || gender === 'G') ? ['G'] : ['F'])}/>
                            <label className={styles.sex}>U</label>
                            <input id='Sex-U' type='radio' name='Sex' defaultChecked={article ? (sex.includes('M') && sex.includes('F')) || (sex.includes('G') && sex.includes('B')) : true } value='U' onChange={e => setSex((gender === 'B' || gender === 'G') ? ['B','G'] : ['M','F'])}/>
                        </div>
                    </div>
                }
                <br/>

                <div>
                    <p>Talles:</p>
                    <div className={styles.sizes}>{
                        sizes.map((size, index) => <input 
                            key={index} 
                            className={`${styles.inputText} ${styles.tinyInput}`} 
                            defaultValue={size}
                            onChange={e => setSize(index, e.target.value)}
                        />)
                    }
                    <div className={styles.plus} onClick={() => addSize()}><p>+</p></div>
                    </div>
                    <br/>
                    <p>En stock:</p>
                    <div className={styles.stocks}>{
                        inStock.map((stock, index) => 
                        <div key={index}>
                            {
                                stock === 'Inf' || stock === 'inf' || stock == true ?
                                    <div className={styles.stockinput}>
                                        <p style={{marginRight:'1em'}}>{`Talle ${sizes[index]}:`}</p>
                                        <input 
                                            type='checkbox' 
                                            checked={true} 
                                            onChange={() => setStock(index, 0)}
                                        />
                                        <p style={{marginLeft:'.4em'}}>Siempre</p>
                                    </div>
                                    :
                                    <div className={styles.stockinput}>
                                        <p style={{marginRight:'1em', alignSelf:'center'}}>{`Talle ${sizes[index]}:`}</p>
                                        <input 
                                            className={`${styles.inputText} ${styles.tinyInput}`}
                                            onChange={e => setStock(index, e.target.value)}
                                            defaultValue={stock}
                                        />
                                        <p style={{marginRight:'.4em', marginLeft:'1em', alignSelf:'center'}}>Siempre?</p>
                                        <input 
                                            type='checkbox' 
                                            checked={false} 
                                            onChange={() => setStock(index, 'Inf')}
                                        />
                                    </div>
                            }
 
                        </div>)
                    }
                    </div>


                </div>
                <br/>

                <div className={styles.productdataeditable}>
                    <p>Fecha:</p>
                    <input 
                        className={`${styles.inputText} ${styles.tinyInput}`}
                        onChange={e => setDay(e.target.value)}
                        defaultValue={day}
                    />
                    <p>/</p>
                    <input 
                        className={`${styles.inputText} ${styles.tinyInput}`}
                        onChange={e => setMonth(e.target.value)}
                        defaultValue={month}
                    />
                    <p>/</p>
                    <input 
                        className={`${styles.inputText} ${styles.tinyInput}`}
                        onChange={e => setYear(e.target.value)}
                        defaultValue={year}
                    />
                </div>

                <div className={styles.productdataeditable}>
                    <p style={{marginRight:'.5em'}}>Artículo reciente?</p>
                    <input 
                        type='checkbox' 
                        defaultChecked={isRecent} 
                        onChange={() => setIsRecent(recent => !recent)}
                    />
                </div>

            </div>

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

                <div style={{marginBottom:'2em'}} >
                    <p className={styles.addimagetext}>Añadir nueva imagen</p>
                    <input type='file' onChange={handleUploadImage} accept="image/*"/>
                </div>

            <p className='red'>{warning}</p>

            <div className={styles.productdataeditable} style={{justifyContent:'space-evenly'}}>
                <button className='create-button' onClick={()=>handleSave()}>Guardar</button>
                <button className='delete-button' onClick={()=>handleDelete()}>Borrar</button>
            </div>
        </div>
    } catch(e) {
        console.error("Once product has an error", e, article)
        return null
    }

}