import { useRef, useState, forwardRef } from 'react'
import styles from './Input.module.css'

const Input = forwardRef(({label='', extension='', className, name, id, defaultChecked, defaultValue, type, min, max}, ref) => (


    <div className={`${className} ${type === 'checkbox' ? styles.checkbox : ''}`}>
        { label && <p className={styles.label}>{label}</p> }
        <div className={styles.inputContainer}>
            <input 
                id={id}
                name={name}
                ref={ref}
                type={type}
                min={min}
                max={max}
                defaultValue={defaultValue}
                defaultChecked={defaultChecked}
                className={styles.input}
            />
            <p className={styles.extension}>{extension}</p>
        </div>
    </div>

));

export default Input