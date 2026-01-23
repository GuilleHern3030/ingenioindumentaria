import { useEffect, useRef, useState } from 'react'

import styles from './Carousel.module.css'

const Carousel = ({ items, visible=3 }) => {

  //if (visible < 3) throw new Error("Carousel visible items can not be below of 3")

  const trackRef = useRef(null) 
  const [ index, setIndex ] = useState(3) 
  const [ itemWidth, setItemWidth ] = useState(0) 

  const extendedItems = [
    ...items.slice(-visible),
    ...items,
    ...items.slice(0, visible),
  ] 

  const updateWidth = () => {
    try {
      if (!trackRef.current) return 
      const width = trackRef.current.children[0].getBoundingClientRect().width 
      setItemWidth(width) 
      //trackRef.current.style.transition = "none"  // evitar animación al refrescar
      trackRef.current.style.transform = `translateX(-${width * index}px)` 
    } catch(e) { }
  } 

  useEffect(() => {
    updateWidth() 
    window.addEventListener("resize", updateWidth) 

    return () => {
      window.removeEventListener("resize", updateWidth) 
    } 
  }, [ index, items ]) 

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

export default Carousel