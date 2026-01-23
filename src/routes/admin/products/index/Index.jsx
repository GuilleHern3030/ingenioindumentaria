import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from 'react-router-dom'
import { useOutletContext } from "react-router-dom";

import styles from './Index.module.css'

import { selectAll } from "@/api/products"
import { request } from "@/api";

// Icons
import addIcon from "@/assets/icons/add.webp"

// Hooks
import { getParam } from "@/hooks/useParams";

// Componentes globales
import Dialog from "@/components/dialog/Dialog"

// Componentes locales
import Products from "./components/products/Products"
import CategorySelector from "./components/category-selector/CategorySelector";
import Loading from "@/components/loading/Loading";


export default () => {

    const { t } = useOutletContext();

    const [ dialog, setDialog ] = useState()

    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState()

    const [ categories, setCategories ] = useState([])
    const [ products, setProducts ] = useState()

    const [ category, setCategory ] = useState(undefined)

    const initialized = useRef(false)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true

        request(setIsLoading, setError, selectAll)
        .then(response => {

            console.log(response)

            setCategories(response.categories)
            setProducts(response.products)

            const slug = getParam("slug")
            if (slug && response.products.categorized.find(category => category.slug == slug) != undefined) 
                setCategory(slug)

        })
        .catch(e => {
            console.error(e)
            /*if (e?.isNetworkError())
                setNetworkError(true)*/
        })

    }, [])

    const handleProductSelected = (product) => {
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
        setCategory(slug)
    }

    return isLoading ? <Loading/> : error ? <p className="error">{error}</p> : <>

        { category === undefined ? 
            <CategorySelector 
                categories={categories} 
                products={products}
                onSelect={handleCategorySelect} 
                t={t}
            /> 
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