import { useState, useEffect } from 'react'

export const goTop = (smooth=false) => smooth ? 
  document.getElementById("header")?.scrollIntoView({ behavior: "smooth" }) 
  : window.scrollTo({top:0})

export const scrollTo = (id) => id ? 
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }) 
  : window.scrollTo({top:0})

export function useScreenWidth(element = window) {

  const [ width, setWidth ] = useState(element.innerWidth)

  const update = () => 
    setWidth(element.innerWidth)

  useEffect(() => {
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return width

}