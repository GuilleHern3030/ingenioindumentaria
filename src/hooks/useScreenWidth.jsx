import { useState, useEffect } from 'react'

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

export default useScreenWidth