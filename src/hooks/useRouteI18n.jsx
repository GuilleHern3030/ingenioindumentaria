import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "@/utils/i18n";

export const language = i18n.language

const useI18n = (namespace) => {

  const [ ready, setReady ] = useState(false)

  const [ language, changeLanguage ] = useState(i18n.language)

  const setLanguage = (lang) => {
    changeLanguage(lang)
    i18n.changeLanguage(lang)
  }

  useEffect(() => {
    i18n.loadNamespaces(namespace).then(() => { setReady(true) })
  }, [])

  const { t } = useTranslation(namespace)

  return { t, ready, namespace, language, setLanguage }

}

/**
 * Carga las traducciones de i18n según la ruta
 */
export const useRouteI18n = (...path) =>
  useI18n([...path, useLocation().pathname, ''].join(','))


// default_messages
import { default_lang } from "@/routes/locales/config.json"
import routes_index_en from "@/routes/locales/en.json"
import routes_index_es from "@/routes/locales/es.json"
import common_en from "@/locales/common/en.json"
import common_es from "@/locales/common/es.json"
import error_en from "@/locales/error/en.json"
import error_es from "@/locales/error/es.json"
import cart_en from "@/locales/cart/en.json"
import cart_es from "@/locales/cart/es.json"
import user_en from "@/locales/user/en.json"
import user_es from "@/locales/user/es.json"

/**
 * Carga las traducciones comunes de i18n ubicadas en src/locales
 */
export const useCommonI18n = () => {

  //const [ language, changeLanguage ] = useState(i18n.language)
  const language = () => i18n.language

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  const index = (lang) => {
    switch(lang) {
      case "es": return routes_index_es;
      case "en": return routes_index_en;
      default: return index(default_lang)
    }
  }

  const lang = (local, lang) => {
    if (local === 'common') switch(lang) {
      case "es": return common_es;
      case "en": return common_en;
      default: return lang(default_lang)
    }
    else if(local === 'error') switch(lang) {
      case "es": return error_es;
      case "en": return error_en;
      default: return lang(default_lang)
    }
    else if(local === 'cart') switch(lang) {
      case "es": return cart_es;
      case "en": return cart_en;
      default: return lang(default_lang)
    }
    else if(local === 'user') switch(lang) {
      case "es": return user_es;
      case "en": return user_en;
      default: return lang(default_lang)
    }
  }

  /**
   * Devuelve un texto traducido si es que existe
   * @param {string} str código de traduccion (ejemplo: 'common:welcome')
   * @returns {string} texto traducido si existe o código de traducción
   */
  const t = (str) => {
    try {
      if (!str.includes(":"))
        return index(language())[str] ?
          index(language())[str] : str
      else {
        const local = str.split(":")[0]
        const _str = str.split(":")[1]
        return lang(local, language())[_str] ?
          lang(local, language())[_str] : str
      }
    } catch(e) {
      console.warn(e)
      return str
    }
  }

  return { t, ready:true, namespace:'', language, setLanguage }
  
}