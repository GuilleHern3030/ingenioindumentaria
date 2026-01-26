import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useOutletContext } from "react-router-dom";

import styles from './Index.module.css'

import { selectAll } from "@/api/products"
import { reload, request } from "@/api";

// Icons
import addIcon from "@/assets/icons/add.webp"

// Hooks
import { getParam } from "@/hooks/useParams";

// Componentes globales
import Dialog from "@/components/dialog/Dialog"
import Loading from "@/components/loading/Loading";

// Componentes locales
import Products from "./components/products/Products"
import CategorySelector from "./components/category-selector/CategorySelector";
import Reload from "../../components/reload/Reload";

const TRIES = 5

export default () => {

    const { t } = useOutletContext();

    const [ dialog, setDialog ] = useState()

    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState()
    const [ networkError, setNetworkError ] = useState(false)

    const [ categories, setCategories ] = useState([])
    const [ products, setProducts ] = useState()

    const [ category, setCategory ] = useState(undefined)

    const initialized = useRef(false)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true
        loadData()
    }, [])

    const loadData = (tries = TRIES) => {
        request(setIsLoading, setError, selectAll)
        .then(response => {

            console.log(response)
            setNetworkError(false)

            setCategories(response.categories)
            setProducts(response.products)

            const slug = getParam("slug")
            if (slug && response.products.categorized.find(category => category.slug == slug) != undefined) 
                setCategory(slug)

        })
        .catch(e => {
            if (e.adminSessionExpired()) setIsAdminSessionActive(false)
            else if (tries > 0) loadData(tries - 1)
            else {
                console.error(e)
                if (e?.isNetworkError())
                    setNetworkError(true)
            }   
        })
    }

    const handleProductSelected = (product) => {
        window.scrollTo({top:0})
        navigate(`${product.id}`,
            {
                state: {
                    from: location.pathname,
                    product: product,
                    slug: category 
                }
            }
        )
    }

    const handleProductCreate = () => {
        window.scrollTo({top:0})
        navigate("new", 
            {
                state: { 
                    from: location.pathname,
                    slug: category 
                }
            }
        )
    }

    const handleCategorySelect = (slug) => {
        document.getElementById("header")?.scrollIntoView({ behavior: "smooth" })
        setCategory(slug)
    }

    return isLoading ? <Loading/> : error ? <>
            <p className="error">{error}</p>
            { networkError === true && <Reload onClick={loadData}/> }
        </> : <>

        { category === undefined ? <>
                <CategorySelector 
                    categories={categories} 
                    products={products}
                    onSelect={handleCategorySelect} 
                    t={t}
                /> 
                <div className={styles.create}>
                    <button 
                        onClick={handleProductCreate} 
                        className='button_square_white'
                        >{t('create')}
                    </button>
                </div>
            </>
            :
            <Products
                categories={categories} 
                category={category}
                onSelect={handleProductSelected}
                onCreate={handleProductCreate}
                onBack={() => handleCategorySelect(undefined)}
                t={t}
            />
        }

        { dialog }
    </>
}