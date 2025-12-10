Controllers
Los Controllers se encargan de hacer la petición a la base de datos de forma directa, sin importar el resultado o incluso si se obtiene un error

Handlers
Los Handlers se encargan de manejar el resultado de la petición del Controller. Es decir, gestionan el resultado y lo devuelve al usuario de una forma útil.

Models
Son los que establecen la forma y formato de los resultados de cada petición.

Cuando se realiza una petición, esta devuelve una Promise la cual, si llega el resolve, es que la petición se realizó con éxito. En cambio, si llega el catch, la petición falló

Variables del Config
---------------------
* loadFromLocalStorage: permite cargar artículos desde el 'localStorage'
* loadFromGoogleSheets: permite cargar artículos desde un GoogleSheets
* loadFromBackend: permite cargar artículos desde el backend
* lazyLoading: establece que se mantenga comunicación activa con el backend permitiendo lazy loading (o paginación) en vez de solicitar toda la información a la vez desde el inicio. No es compatible con la carga de datos desde el 'localStorage' o desde GoogleSheets.
* lazyLoadLimit: establece cuántos articulos se cargan por vez en cada página
* useIndexedDB: permite cargar datos desde el indexed db
* cacheTime: tiempo en minutos en que el caché se considera válido
* adminSignTime: tiempo en minutos en que la sesión de un admin es válida
* localStorage: ruta local de un JSON con artículos precargados
* usersCanSignIn: habilita el inicio de sesión en el website
* usersCanUseShoppingCart: habilita el carrito del website
* usersCanSearch: habilita la barra de búsqueda del website
* usersCanBuy: habilita las compras en el website
* usersCanConsult: habilita consultar sobre productos en el website (require un medio de contacto)
* googleSheetsApiKey: key con el que GoogleSheets permite la lectura de la tabla
* googleSheetsId: id del GoogleSheets donde se aloja una tabla con articulos
* googleSheetsName: nombre de la tabla donde están los artículos en el GoogleSheets
* maxImagesPerProduct: cantidad máxima de imágenes por producto
* maxImagesSizePerProduct: tamaño máximo del conjunto de imágenes de un producto en KB
* maxImagesSize: tamaño máximo de todas las imágenes alojadas en el backend en KB
* maxImageSize: tamaño máximo por imagen en KB
* maxMessageSize: tamaño máximo de un mensaje en caracteres
* imagesType: array de extensiones de imagen válidas
* apiUrl: link del backend