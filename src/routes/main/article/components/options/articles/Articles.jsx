import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './Articles.module.css'

import IdUtils from '@/utils/IdUtils'

import useScreenWidth from '@/hooks/useScreenWidth'
import useClientInfo from '@/hooks/useClientInfo'

import Carousel from '@/components/carousel/Carousel'
import Article from './article/Article'

export default ({ articles, variant, onSelect, alt }) => {

  const [ visible, setVisible ] = useState()
  const [ items, setItems ] = useState()
  const { dataLoaded, decimals } = useClientInfo()

  const navigate = useNavigate()
  const width = useScreenWidth()

  useEffect(() => {
    if (width < 330) setVisible(1)       // Little Mobile
    else if (width < 480) setVisible(2)  // Mobile
    else if (width < 768) setVisible(3)  // Tablet
    else setVisible(4)                   // Desktop
  }, [ width ])

  useEffect(() => { 
    setItems(articles.map((article, key) =>
      <Article
        key={key}
        selected={variant.id == article.id}
        article={article}
        digits={decimals}
        alt={alt}
        onSelect={onSelect}
      />
    ))
  }, [ variant, articles ])

  return dataLoaded && visible && articles?.length > 1 && <aside className={styles.articles}>
    { articles.length > visible ?
      <Carousel visible={visible} items={ items } />
      : <div className={styles.carousel}> { items } </div>
    }
  </aside>
}