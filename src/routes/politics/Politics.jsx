import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"
import { useNavigate } from 'react-router-dom'

import useClientInfo from "../../hooks/useClientInfo"
import { title as pageName } from "../../assets/data/data.json"

export default () => {

    const { data } = useClientInfo()
    const navigate = useNavigate()

    return <>
        <Header/>
    
        {data && <section className={`unselectable`}>
            <div style={{margin:'1em'}}>
                <div class="col s12 t-u-a px-5">
                    <h1 class="center">Políticas de Privacidad</h1>
                    <p>{pageName} como encargada del tratamiento de datos personales del sitio, mediante la presente Política de Privacidad de Datos, pone en conocimiento de los Usuarios los alcances de la protección integral de sus datos personales asentados en los archivos; registros; bancos o bases de datos; u otros medios técnicos de tratamiento de datos implementados por {pageName}, asegurando el respeto al derecho a la intimidad de las personas, así como también al libre acceso a la información que sobre las mismas pueda eventualmente registrarse. {pageName}, considera que cualquier tipo de información relativa a un Usuario es información de carácter personal, y por consiguiente vela en todo momento por la privacidad y confidencialidad de la misma. La confidencialidad de la información relativa a los Usuarios implicará su mantenimiento en archivos y/o bancos o bases de datos seguros, de modo tal que el acceso por parte de terceros que no se encuentren autorizados a tal efecto, se encuentre restringido. Para preguntas sobre esta Política o cualquier circunstancia relativa al tratamiento de información de carácter personal, los Usuarios podrán contactarse a través del siguiente medio de contacto: E-mail: <a href={`mailto:${data.email}`}>{data.email}</a></p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Voluntariedad en la entrega de datos.</h2>
                    <p>La presente Política está destinada a informar a los usuarios acerca del tratamiento de datos personales llevado adelante por {pageName}, con el objeto que libre y voluntariamente determinen la entrega o no, de sus datos personales cuando les sean requeridos o que se puedan obtener a partir de la utilización de alguno de los servicios disponibles en el sitio.</p>
                    <p>Por regla general, cuando para utilizar un servicio o acceder a cierto contenido se solicite algún dato personal, la entrega del mismo no es obligatoria, con excepción de aquellos casos donde específicamente se indicara que es un dato requerido para la prestación del servicio o el acceso al contenido.</p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Autorización de uso de la información personal</h2>
                    <p>El usuario que facilitara sus datos personales, autoriza expresamente a {pageName} para el uso de los datos aportados con los fines aquí expuestos. Implica ello además la aceptación de todos los términos contenidos en esta Política, y en los <span style={{color:'blue'}} onClick={() => navigate("/terms")}>Términos y Condiciones Generales</span>.</p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Recolección y uso de Información</h2>
                    <p>La recolección y tratamiento de datos de carácter personal tiene por finalidad la prestación, gestión, administración, personalización, actualización y mejora de los de los servicios y contenidos puestos a disposición de los usuarios por parte de {pageName}</p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Comunicaciones del Sitio</h2>
                    <p>Ocasionalmente los datos podrán ser utilizados para el envío de comunicaciones a los Usuarios, en lo referente a los servicios y contenidos brindados por {pageName} y/o sus socios comerciales, tales como newsletter y/o encuestas, y/o promociones, y/o información comercial, entre otros. Cuando un Usuario prefiera no ser contactado con estos fines, podrá:</p>
                    <p>a. Comunicarse con {pageName} según los datos de contacto aquí suministrados, y solicitar que no le sea enviada información sobre los productos y servicios.<br/>
                    b. Ejecutar de las instrucciones a ese efecto incluidas en los correos enviados por {pageName}</p>
                    <p>Finalmente se enviarán a los Usuarios mensajes relacionados con el estado o cambios relativos a los productos o servicios de {pageName} siempre que ello sea necesario. Así por ejemplo, si nuestro servicio es interrumpido temporalmente por mantenimiento.</p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Intransferibilidad de los datos</h2>
                    <p>Todos los datos personales recolectados de los Usuarios, son de uso exclusivo de {pageName} Toda vez que se recabe información personal como parte de la relación directa con un Usuario, en respeto a la privacidad y confidencialidad de los Usuarios, {pageName} no cederá ni transferirá esa información personal a ningún tercero que no sea parte de {pageName} o sus asociados. Únicamente se compartirá con terceros la información personal de los Usuarios, en los siguientes casos:</p>
                    <p>a. Cuando exista obligación legal de hacerlo.<br/>
                    b. Cuando exista una orden emanada de un Tribunal de Justicia competente.<br/>
                    c. Cuando resulte necesario para la investigación de un delito.</p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Encuestas o Concursos</h2>
                    <p>Esporádicamente {pageName} ofrece a sus Usuarios la oportunidad de participar en sorteos y concursos. Como requisito para la participación, podrá requerirse datos adicionales de los Usuarios. La participación en estos eventos es enteramente voluntaria, y la información requerida típicamente incluye datos de contacto y de orden demográfico, a efectos de hacer posible la notificación de los ganadores y entrega de premios.</p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Derechos de los titulares de los datos</h2>
                    <p>A su vez, y como consecuencia de la garantía de los derechos amparados, se expresa también como finalidad, la de permitir en todo momento el acceso a la información por parte de las personas vinculadas a los datos registrados. De este modo, el Usuario podrá ejercitar los derechos de acceso, rectificación o cancelación de datos y oposición, que más adelante se mencionarán.</p>
                    <p>El ejercicio de dichos derechos podrá ser efectivizado por cada usuario mediante comunicación dirigida a {pageName}, según la información de contacto aquí brindada.</p>
                    <p>Efectuado el ingreso de los datos por los usuarios, {pageName}, procederá a la rectificación, supresión o actualización de los datos personales del afectado, cuando ello fuere procedente.</p>
                    <p>La supresión de algún/nos datos no procederá cuando pudiese causar perjuicios a derechos o intereses legítimos de terceros, o cuando existiera una obligación legal de conservar los datos.</p>
                    <p>El derecho a exigir la rectificación de los datos: En principio, el derecho a exigir la rectificación puede ser ejercido ante la falsedad, inexactitud, imprecisión o carácter erróneo que tengan los datos. Su reconocimiento implica el de la preservación de la veracidad de la información, condición que hace a la calidad de la misma.</p>
                    <p>El derecho a requerir la actualización de los datos: La actualización estriba en preservar la vigencia del dato, esto es, la correspondencia de la fracción de información que representa con el ámbito temporal en que es proporcionado Los derechos a la adición y disociación: Los usuarios podrán requerir que se adicionen informaciones a los datos registrados, cuando se consideren incompletos de modo tal que no reflejen las realidades que representan. En similar sentido, también podrán exigir la disociación de datos cuyas calidades o características sólo permitan su tratamiento sin posibilidad de establecer asociaciones o vinculaciones con los titulares de los datos. Los derechos a la supresión y sometimiento a la confidencialidad: La "supresión" de un dato implica su eliminación definitiva del archivo o registro, esto es su completa desaparición, sin que puedan quedar constancias de su anterior registración.</p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Sobre las Cookies</h2>
                    <p>Eventualmente el sitio puede utilizar cookies, que se instalarán en la computadora del usuario cuando este navegue por el sitio. Tienen por finalidad facilitar la navegación por el sitio al usuario, y proporcionar a {pageName}, información que le ayudara a mejorar los sus servicios y contenidos. En ningún caso las cookies utilizadas por el sitio proporcionarán información de carácter personal de usuario, quien en relación a las mismas mantendrá pleno anonimato, aun frente a {pageName}, dado que tampoco suministran información tendiente a la individualización del usuario. Es intención de {pageName} poner de resalto que para navegar por el sitio, no resulta necesario que el usuario permita la instalación de las cookies enviadas por el sitio. Ello solo podrá requerirse en relación a ciertos servicios y/o contenidos. El sitio puede incluir cookies anónimas colocadas por terceros (proveedores de tecnología) en el navegador utilizado por los visitantes. Conforme a lo dispuesto en la normativa de protección de datos, {pageName} tendrá derecho de acceso, rectificación y cancelación de los datos personales recopilados con la única finalidad de prestar el servicio.</p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Utilizamos métodos de seguridad apropiados</h2>
                    <p>En {pageName} la seguridad es importante. {pageName} adopta todas las medidas de seguridad lógica y física exigidas por las reglamentaciones, y las que resultan de la adecuada prudencia y diligencia en la protección de los Usuarios que han depositado su confianza en {pageName}, para proteger la información personal reunida contra el acceso no autorizado, alteración o destrucción. {pageName} evalúa y mejora sus sistemas de seguridad toda vez que sea necesario.</p>
                    <h2 style={{marginTop:'1.5em', marginBottom:'.3em'}}>Cambios a esta Política</h2>
                    <p>En caso de modificación de esta Política, publicaremos esos cambios en esta sección, la página principal del Sitio, y otros lugares que sean considerados apropiados para notificar a los Usuarios sobre los cambios. {pageName} se reserva el derecho a modificar esta Política en cualquier momento, a cuyo efecto los Usuarios deberán tomar conocimiento de la misma en forma regular, recurriendo a la lectura de la misma con una frecuencia no menor a una vez a la semana.</p>
                    <br/>
                </div>
            </div>
        </section>}
        
        <Footer/>
    
    </>


}