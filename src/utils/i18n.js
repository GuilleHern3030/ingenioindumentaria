import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { default_lang } from "@/routes/locales/config.json"

const translationCache = {}

export const language = localStorage.getItem("i18next")

i18n
  .use({
    type: "backend",
    init() {},
    async read(language, namespace, callback) {
      try {

        const cacheKey = `${language}::${namespace}`
      
        // Buscar todos los JSON bajo src/
        //const modules = import.meta.glob( "/src/routes/**/locales/*.json" );

        // Construir el path esperado
        /*const expectedPath = `/src/routes/${namespace}/locales/${language}.json`.replaceAll("//", "/");
        console.log(expectedPath)

        if (!modules[expectedPath]) {
          return callback(new Error("Translation not found"))
        }

        // Cargar dinámicamente
        modules[expectedPath]()
          .then((mod) => {
            console.log(mod)
            callback(null, mod.default)
          }).catch((err) => callback(err));*/


        // Verificar cache
        if (translationCache[cacheKey]) 
          return callback(null, translationCache[cacheKey])

        // Convertir string en array "admin/products,admin/messages","" → ["admin/products","admin/messages",""]
        const namespaces = namespace
          .split(",")
          .map(n => n.trim())

        // Glob de todos los JSON
        const modules = import.meta.glob("/src/routes/**/locales/*.json");

        // -----------------------------------------
        // Construir lista de archivos posibles
        // Para cada namespace buscamos:
        //   /src/routes/${ns}/locales/${language}.json
        // -----------------------------------------
        const expectedPaths = namespaces.map(ns => 
          `/src/routes/${ns}/locales/${language}.json`
            .replaceAll("//", "/")
        );

        // Encontrar los paths que realmente existen
        const realPaths = expectedPaths.filter(p => modules[p])
        if (realPaths.length === 0) {
          return callback(null, {}); // no hay traducciones
        }

        // Cargar todos los JSON en paralelo
        const loaded = await Promise.all(
          realPaths.map(path => modules[path]().then(mod => mod.default))
        )

        // Merge de todos los JSON del idioma
        const merged = loaded.reduce((acc, current) => {
          return { ...acc, ...current }
        }, {})

        // Guardar en cache
        translationCache[cacheKey] = merged;

        callback(null, merged);

      } catch (err) { callback(err) }

    }
  })
  .use(initReactI18next)
  .init({
    lng: language || default_lang,
    fallbackLng: "en",
    debug: false,
    ns: [],                  // namespaces dinámicos
    defaultNS: false,
    interpolation: { escapeValue: false }
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("i18next", lng)
});

i18n.on("initialized", () => {
  localStorage.setItem("i18next", i18n.language)
})

export default i18n;