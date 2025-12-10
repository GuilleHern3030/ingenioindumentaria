import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Articles.module.css'

import Product from '@/api/products'
import IdUtils from '@/utils/IdUtils'

import useScreenWidth from '@/hooks/useScreenWidth'
import useClientInfo from '@/hooks/useClientInfo'

import Article from '@/components/articles/Article'

export default ({ articles, limit, t }) => {

    const [ visible, setVisible ] = useState()
    const { data } = useClientInfo()

    const navigate = useNavigate()
    const width = useScreenWidth()

    const handleArticleSelect = (id) => 
        navigate("/article/" + IdUtils.serialize(id))

    useEffect(() => {
        if (width < 330) setVisible(1)       // Little Mobile
        else if (width < 480) setVisible(2)  // Mobile
        else if (width < 768) setVisible(3)  // Tablet
        else setVisible(4)                   // Desktop
    }, [width])

    return data && articles?.length >= 3 && <section>

        <h2 className={styles.title}>{t('outstanding')}</h2>

        { articles.length >= 3 ? 
            visible && 
                <Carousel 
                    visible={visible}
                    items={
                        articles.slice(0, limit >= 3 ? limit : 3)
                        .map((article, key) => 
                            <Article 
                                key={key} 
                                article={new Product(article)} 
                                digits={data.decimals}
                                onSelect={handleArticleSelect}
                            />
                        )
                    }
                />
            : <>
            </>
        }
    </section>
}

const Carousel = ({ items, visible=3 }) => {
  const trackRef = useRef(null) 
  const [ index, setIndex ] = useState(3) 
  const [ itemWidth, setItemWidth ] = useState(0) 

  const extendedItems = [
    ...items.slice(-visible),
    ...items,
    ...items.slice(0, visible),
  ] 

  const updateWidth = () => {
    if (!trackRef.current) return 
    const width = trackRef.current.children[0].getBoundingClientRect().width 
    setItemWidth(width) 
    //trackRef.current.style.transition = "none"  // evitar animación al refrescar
    trackRef.current.style.transform = `translateX(-${width * index}px)` 
  } 

  useEffect(() => {
    updateWidth() 
    window.addEventListener("resize", updateWidth) 

    return () => {
      window.removeEventListener("resize", updateWidth) 
    } 
  }, [index]) 

  const moveTo = (i) => {
    trackRef.current.style.transition = "transform 0.3s ease-in-out" 
    trackRef.current.style.transform = `translateX(-${itemWidth * i}px)` 
  } 

  const next = () => {
    const newIndex = index + 1 
    setIndex(newIndex) 
    moveTo(newIndex) 

    if (newIndex === extendedItems.length - visible) {
      setTimeout(() => {
        const reset = visible 
        trackRef.current.style.transition = "none" 
        setIndex(reset) 
        trackRef.current.style.transform = `translateX(-${itemWidth * reset}px)` 
      }, 300) 
    }
  } 

  const prev = () => {
    const newIndex = index - 1 
    setIndex(newIndex) 
    moveTo(newIndex) 

    if (newIndex === 0) {
      setTimeout(() => {
        const reset = extendedItems.length - visible * 2 
        trackRef.current.style.transition = "none" 
        setIndex(reset) 
        trackRef.current.style.transform = `translateX(-${itemWidth * reset}px)` 
      }, 300) 
    }
  } 

  return (
    <div className={styles.carousel}>
      <button className={styles.prev} onClick={prev}>&#10094;</button>

      <div className={styles.carousel_window}>
        <div className={styles.carousel_track} ref={trackRef}>
          {extendedItems.map((item, i) => (
            <div 
                className={styles.carousel_item} 
                style={{ minWidth: `${100 / visible}%` }}
                key={i}>
                {item}
            </div>
          ))}
        </div>
      </div>

      <button className={styles.next} onClick={next}>&#10095;</button>
    </div>
  ) 
}