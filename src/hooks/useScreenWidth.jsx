import { useState, useEffect } from 'react'

export function useScreenWidth() {

  const [ width, setWidth ] = useState(window.innerWidth)

  const update = () => 
    setWidth(window.innerWidth)

  useEffect(() => {
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return width

}

export default useScreenWidth