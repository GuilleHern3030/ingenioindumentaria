Controllers
Los Controllers se encargan de hacer la petición a la base de datos de forma directa, sin importar el resultado o incluso si se obtiene un error

Handlers
Los Handlers se encargan de manejar el resultado de la petición del Controller. Es decir, gestionan el resultado y lo devuelve al usuario de una forma útil.

Models
Son los que establecen la forma y formato de los resultados de cada petición.

Cuando se realiza una petición, esta devuelve una Promise la cual, si llega el resolve, es que la petición se realizó con éxito. En cambio, si llega el catch, la petición falló