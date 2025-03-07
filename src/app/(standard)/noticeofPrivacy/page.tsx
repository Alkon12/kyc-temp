import React from 'react'
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material'

const AvisoDePrivacidad: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          textAlign: 'left',
          minHeight: '100vh',
          pb: { xs: '2rem', md: '0rem' },
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Aviso de Privacidad
        </Typography>
        <Typography variant="body1" paragraph>
          I. IDENTIFICACIÓN DEL RESPONSABLE.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          En <strong>AUTOFIN RENT, S.A. DE C.V.</strong> en lo sucesivo <strong>AUTOFIN RENT</strong> con domicilio en Avenida Insurgentes Sur, número 1235, Colonia Extremadura Insurgentes, Alcaldía Benito Juárez, Código Postal 03740, en la Ciudad de México; le comunicamos que la información personal de todos nuestros clientes y clientes potenciales es tratada de forma estrictamente confidencial, por lo que podrán sentirse plenamente seguros de que al adquirir nuestros bienes y/o servicios, hacemos un esfuerzo permanente para salvaguardarla y protegerla.
        </Typography>
        <Typography variant="body1" paragraph>
          II. MEDIOS DE OBTENCIÓN Y DATOS PERSONALES QUE SE RECABAN.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          <strong>AUTOFIN RENT</strong> recaba los siguientes datos personales necesarios y aplicables para dar cumplimiento a las finalidades del presente Aviso de Privacidad, dependiendo de la relación que con usted exista.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          a. Datos personales que recabamos de manera personal: Datos personales de identificación, laborales, patrimoniales, financieros, datos de terceros (Al proporcionar los datos personales de terceros, se entiende que cuenta con el consentimiento del titular de los datos personales).
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          b. Datos personales que recabamos de manera directa a través de página web, correo electrónico y vía telefónica: Datos personales de identificación, laborales, patrimoniales, financieros, datos de terceros (Al
          proporcionar los datos personales de terceros, se entiende que cuenta con el consentimiento del titular de los datos personales).
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          c. Datos personales que recabamos de manera indirecta a través de transferencias de terceros y fuentes de acceso públicos que están permitidas por la Ley: Datos personales de identificación.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          Si usted participa en eventos, reportajes, se le comunica que las imágenes y sonidos captados, podrán ser difundidas a través de medios de comunicación interna y las distintas redes sociales. Si participa en algún proceso indicado en el Numeral III. Finalidades descrito en este Aviso de Privacidad, y se requiera obtener imágenes, videos, y sonidos, estos serán tratados como soporte del seguimiento al cumplimiento de estas, así como de carácter legal.<br />Asimismo, los sonidos recabados a través de los distintos medios utilizados serán tratados como soporte del seguimiento de la calidad de nuestros servicios.
        </Typography>
        <Typography variant="body1" paragraph>
          III. FINALIDADES.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          Más que una política, en <strong>AUTOFIN RENT</strong> tenemos la filosofía de mantener una relación estrecha y activa con nuestros clientes y clientes potenciales. En términos de lo establecido por La Ley Federal de Protección de Datos Personales en Posesión de los Particulares (La Ley) y su Reglamento, los datos personales que nos proporcione serán utilizados para las siguientes finalidades:
        </Typography>
        <Typography variant="body2" paragraph>
          a. Necesarias para la prestación del servicio:
        </Typography>
        <ol style={{ listStyleType: 'lower-roman' }}>
            <li>
              <ListItemText  
                  primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                  primary="Realizar los trámites, procedimientos y gestiones para el arrendamiento y/o adquisición de bienes, productos y/o servicios para nuestros clientes y clientes potenciales."                
                />
            </li>
            <li>
              <ListItemText  
                primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                primary="Comercialización de vehículos automotores seminuevos."                
              />
            </li>
            <li>
              <ListItemText  
                  primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                  primary="Proveerle al cliente servicios de arrendamiento puro de vehículos nuevos y/o seminuevos, administración de flotas o renting (consistente en renta de un vehículo más la administración del mismo, así como el desflote, entrega, y/o devolución)."                
                />
            </li>
            <li>
              <ListItemText  
                primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                primary="Proporcionarle gestoría de trámites relativos al servicio de arrendamiento que haya contratado el cliente (tenencia y verificación vehicular)."                
              />
            </li>
            <li>
              <ListItemText  
                primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                primary="Ofrecerle servicios de mantenimientos preventivos y correctivos"                
              />
            </li>
            <li>
              <ListItemText  
                  primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                  primary="Informar sobre las campañas de seguridad de los vehículos automotores que promueva la planta armadora (llamada/recall), así como de actualizaciones técnicas."                
                />
            </li>
            <li>
              <ListItemText  
                primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                primary="Control y seguimiento de siniestros en el servicio que el cliente haya contratado."                
              />
            </li>
            <li>
              <ListItemText  
                  primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                  primary="Consultar el historial crediticio ante las sociedades de información crediticia (Buró de Crédito)."                
                />
            </li>
            <li>
              <ListItemText  
                primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                primary="Investigación ante las dependencias oficiales correspondientes de las garantías otorgadas (Aval)."                
              />
            </li>
            <li>
              <ListItemText  
                  primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                  primary="Cumplir con leyes, reglamentos y demás disposiciones legales aplicables para el arrendamiento y comercialización de vehículos automotores seminuevos."                
                />
            </li>
            <li>
              <ListItemText  
                primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                primary="Realizar los diversos trámites para gestionar ante las autoridades competentes, el alta de los vehículos automotores en los padrones vehiculares correspondientes."                
              />
            </li>
            <li>
              <ListItemText  
                  primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                  primary="Procesar solicitudes, realizar actividades de cobranza, facturación y aclaraciones."                
                />
            </li>
            <li>
              <ListItemText  
                primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                primary="Mantener actualizados nuestros registros para poder responder a sus consultas."                
              />
            </li>
            
        </ol>
        <Typography variant="body2" paragraph>
          b. No necesarias para la prestación del servicio:
        </Typography>
        <ol>
          <li>
            <ListItemText  
              primaryTypographyProps={{ variant:'body2', align: 'justify'}}>
              Realizar actividades de mercadotecnia, publicidad y prospección comercial, diversas a los bienes,
            productos y servicios que brinda <strong>AUTOFIN RENT</strong>.                
            </ListItemText>
          </li>
          <li>
            <ListItemText  
                primaryTypographyProps={{ variant:'body2', align: 'justify'}} >
                Realizar estudios internos sobre hábitos de consumo, mercadotecnia, publicidad y prospección comercial, relacionada con los bienes, productos y servicios que ofrece <strong>AUTOFIN RENT</strong>.                
            </ListItemText>
          </li>
          <li>
            <ListItemText  
                primaryTypographyProps={{ variant:'body2', align: 'justify'}}
                primary="Dar seguimiento a nuestra relación comercial y solicitar evaluación y el seguimiento para conocer el nivel de satisfacción de nuestros bienes, productos y servicios."                
              />
          </li>
        </ol>
        <Typography variant="body2" paragraph align={'justify'}>
          Es importante mencionar que las finalidades (i), (ii), (iii), (iv), (v), (vi), (vii), (viii), (ix), (x), (xi), (xii), y (xiii) dan origen y son necesarias.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          Las finalidades (1), (2) y (3) no son necesarias, pero son importantes para ofrecerle a través de campañas de mercadotecnia, publicidad y prospección comercial, bienes, productos y servicios exclusivos, por lo que usted tiene derecho a oponerse, o bien, a revocar su consentimiento para que <strong>AUTOFIN RENT</strong> deje de tratar sus datos personales para dichas finalidades, de acuerdo al procedimiento señalado en el apartado IV o V del presente Aviso de Privacidad.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          Se hace de su conocimiento que cuenta con un plazo de 5 días hábiles para manifestar su negativa respecto al tratamiento de sus datos personales de identificación obtenidos de manera indirecta, en relación con las finalidades del inciso (b) de este apartado, conforme al mecanismo establecido en el apartado IV del presente aviso de Privacidad.
        </Typography>
        <Typography variant="body1" paragraph>
          IV. OPCIONES PARA LIMITAR EL USO O DIVULGACIÓN DE SUS DATOS PERSONALES.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          <strong>AUTOFIN RENT</strong> le comunica que, si usted desea dejar de recibir mensajes de mercadotecnia, publicidad o de prospección comercial, relativos a las finalidades referidas en el inciso (b) del apartado III, puede hacerlo valer a través del correo electrónico <a href="mailto:protecciondedatos@grupoautofin.com">protecciondedatos@grupoautofin.com</a>, así mismo, por este medio atenderemos sus dudas y comentarios acerca del tratamiento de sus datos personales.
        </Typography>
        <Typography variant="body1" paragraph>
          V. SOLICITUD DE ACCESO, RECTIFICACIÓN, CANCELACIÓN U OPOSICIÓN DE DATOS PERSONALES (DERECHOS ARCO) Y
          REVOCACIÓN DE CONSENTIMIENTO.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          Todos sus datos personales son tratados de acuerdo a la legislación aplicable y vigente en el país, por ello le informamos que usted tiene en todo momento el derecho de <strong>Acceder, Rectificar, Cancelar, u Oponerse</strong> al tratamiento que le damos a sus datos personales, así como Revocar el consentimiento otorgado para el tratamiento de los mismos; derechos que podrá hacer valer en las oficinas centrales de <strong>AUTOFIN RENT</strong> a través del Departamento de Datos Personales ubicado en Avenida Insurgentes Sur número 1235, Colonia Extremadura Insurgentes, C.P. 03740 en México, Distrito Federal, personas que <strong>AUTOFIN RENT</strong> ha designado para tal efecto, o bien, enviando un correo electrónico a <a href="mailto:protecciondedatos@grupoautofin.com">protecciondedatos@grupoautofin.com</a>, para que le sea proporcionado el Formato de Solicitud de Derechos ARCO, mismo que deberá presentar requisitado en el domicilio del Responsable, debiendo adjuntar una copia de su identificación oficial para acreditar su titularidad. La respuesta a su solicitud de Derechos ARCO se le hará llegar al correo electrónico que haya proporcionado, dentro del término de 20 días hábiles contados a partir de la recepción de dicha solicitud. Así mismo, se le informa que el derecho de acceso se tendrá por cumplido cuando se haga llegar la respuesta correspondiente a través del correo electrónico que usted nos haya indicado para tal efecto.<br />
          El ejercicio de los Derechos ARCO será gratuito, en su caso, el titular debe de cubrir los gastos de envío, reproducción y/o certificación de documentos; sin embargo, si el titular ejerce el mismo derecho en un periodo
          no mayor de 12 meses, la respuesta a la solicitud tendrá un costo que no excederá de 3 días de salario mínimo general vigente en el Distrito Federal.<br />
          En caso de no estar de acuerdo en el tratamiento de sus datos personales, puede acudir ante el INAI.
        </Typography>
        <Typography variant="body1" paragraph>
          VI. TRANSFERENCIAS DE DATOS PERSONALES.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          Transferencias sin necesidad de consentimiento:<br />
          Se le informa que a fin de dar cumplimiento a las finalidades establecidas en el inciso (a), apartado IV del presente Aviso de Privacidad, sus datos personales pueden ser transferidos y tratados dentro y fuera de los
          Estados Unidos Mexicanos por personas distintas a <strong>AUTOFIN RENT</strong>. En este sentido y con fundamento en La Ley y su Reglamento, sus datos personales podrán ser transferidos sin necesidad de su consentimiento a: (i) Terceros proveedores de servicios, única y exclusivamente para el cumplimiento de las finalidades establecidas en el inciso (a) del apartado III del presente Aviso de Privacidad; (ii) A instituciones financieras, bancarias crediticias y de autofinanciamiento, para la solicitud de otorgamiento de créditos por el servicio contratado por el cliente; (iii) A aseguradoras para el otorgamiento de pólizas de seguros por el servicio contratado por el cliente; (iv) A empresas trasladistas para hacerle llegar a solicitud del cliente el vehículo a su domicilio; (v) A terceros para realizar gestiones de cobranza extrajudicial y judicial en caso de incumplimiento.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          Transferencias con consentimiento:<br />
          <strong>AUTOFIN RENT</strong> podrá transferir sus datos personales de identificación a empresas de marketing y publicidad para las finalidades descritas en el inciso (b) del apartado III del presente Aviso de Privacidad y a otras empresas del sector distributivo automotor y de bienes, productos y servicios con las que tengamos alguna relación comercial y/o de negocios con la finalidad de otorgarle beneficios al adquirirlos. Si usted no desea que sus datos personales sean transferidos a dichos terceros, puede manifestar su negativa conforme al procedimiento establecido en el apartado IV del presente Aviso de Privacidad.
        </Typography>
        <Typography variant="body1" paragraph>
          VII. USO DE COOKIES:
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          <strong>AUTOFIN RENT</strong>, le informa que utiliza “cookies” para obtener información personal de usted de manera automática. Los datos personales que recabamos de manera electrónica, así como las finalidades del tratamiento se encuentran establecidos en el presente Aviso de Privacidad.
        </Typography>
        <Typography variant="body1" paragraph>
          VIII. MODIFICACIONES AL AVISO DE PRIVACIDAD.
        </Typography>
        <Typography variant="body2" paragraph align={'justify'}>
          Este Aviso de Privacidad podrá ser modificado de tiempo en tiempo por <strong>AUTOFIN RENT</strong>, dichas modificaciones podrán consultarse a través de los siguientes medios:
        </Typography>
        <ol>
          <li>
            <ListItemText  
              primaryTypographyProps={{ variant:'body2', align: 'justify'}}>
              Nuestra página de internet www.autofinrent.com (Sección Aviso de Privacidad).              
            </ListItemText>
          </li>
          <li>
            <ListItemText  
              primaryTypographyProps={{ variant:'body2', align: 'justify'}}>
              Avisos visibles en nuestras instalaciones de <strong>AUTOFIN RENT</strong>.         
            </ListItemText>
          </li>
          <li>
            <ListItemText  
              primaryTypographyProps={{ variant:'body2', align: 'justify'}}>
              Cualquier otro medio de comunicación oral, impreso o electrónico que <strong>AUTOFIN RENT</strong>, determine para tal efecto.     
            </ListItemText>
          </li>
        </ol>
      </Box>
    </Container>
  )
}

export default AvisoDePrivacidad
