import { useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '@/context/ThemeContext'

import styles from './Switch.module.css'

export const ThemeSwitch = ({ className }) => {

  const { theme, setTheme } = useContext(ThemeContext)
  const [ checked, setChecked ] = useState(true)
  const themeRef = useRef()

  const handleChange = e => {
    setChecked(!checked)
    setTheme(checked ? "dark" : "light")
  }

  useEffect(() => {
    setChecked(theme != "dark")
  }, [])

  return <div className={className}>
    <div className={styles.toggle_switch}>
      <label>
        <input
          ref={themeRef}
          className={styles.input}
          checked={checked}
          type='checkbox'
          onChange={handleChange}
        />
        <span className={styles.slider}></span>
      </label>
    </div>
  </div>
}