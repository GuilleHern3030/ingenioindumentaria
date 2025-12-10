import { useEffect, useState } from "react"

import styles from './Image.module.css'

import loading from '@/assets/icons/logo.webp'

export default ({src, alt, className, bottomText, topText}) => {
    
    const [ isLoaded, setIsLoaded ] = useState(false)
    const [ error, setError ] = useState(false)

    return <div className={`${styles.image} ${className}`}> 
        {
            error ? <>
                <p className={styles.alt}>{alt}</p>
                { bottomText && <p className={styles.bottomText}>{bottomText}</p> }
                { topText && <p className={styles.topText}>{topText}</p> }
            </>
            
            : !src ? <>
                    <img 
                        className={styles.logo}
                        src={alt ?? loading} 
                        onError={() => setError(alt)}
                    />
                    { bottomText && <p className={styles.bottomText}>{bottomText}</p> }
                    { topText && <p className={styles.topText}>{topText}</p> }
            </>

            : <>
            
            
                { !isLoaded &&
                    <img 
                        className={`${styles.logo} ${styles.loading}`}
                        src={loading} 
                    />
                }

                <div className={styles.image}>
                    <img 
                        src={src}
                        loading='lazy'
                        onLoad={() => setIsLoaded(true)}
                        onError={() => {
                            setError(alt)
                            setIsLoaded(true)
                        }}
                    />
                    { bottomText && <p className={styles.bottomText}>{bottomText}</p> }
                    { topText && <p className={styles.topText}>{topText}</p> }
                </div>
            </>
        }
    </div>
    
}