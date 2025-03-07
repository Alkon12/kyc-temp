import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Legal: React.FC = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ textAlign: 'left', minHeight: '100vh', pb: { xs: '2rem', md: '0rem' } }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Legales Autofinrent
                </Typography>
                <Typography variant="body2" paragraph>
                La imagen del vehículo presentada puede incluir accesorios y equipamientos opcionales con base en los cuales se elabora esta información.
                </Typography>
                <Typography variant="body2" paragraph>
                <strong>Contrato de semanalidades.</strong> Las semanalidades contratadas podrán ser por un máximo de 52 semanas o 50,000 kilómetros, y reducirse según lo pactado entre las partes.
                </Typography>
                <Typography variant="body2" paragraph>
                <strong>Esquema todo incluido.</strong> Renta mensual de la unidad contratada por el plazo acordado, seguro con cobertura amplia para la prestación transporte privado a través de plataforma digital Uber, GPS, costo de tenencia, placas de circulación, Verificación y mantenimiento preventivo (bajo el concepto de servicio exprés).
                </Typography>
                <Typography variant="body2" paragraph>
                <strong>Servicio exprés.</strong> Este servicio se refiere exclusivamente al mantenimiento preventivo, y no cubre servicios correctivos ni reparaciones derivadas de siniestros.
                </Typography>
                <Typography variant="body2" paragraph>
                <strong>Zona delimitada.</strong> La unidad contratada operará exclusivamente dentro de la Ciudad de México y su área conurbada.
                </Typography>
                <Typography variant="body2" paragraph>
                <strong>Auto nuevo.</strong> Vehículo destinado al transporte privado terrestre de personas a través de plataforma digital UBER, entregado por primera vez, con un máximo de 1,000 kilómetros recorridos y será del año en curso o del siguiente.
                </Typography>
                <Typography variant="body2" paragraph>
                <strong>Renovación.</strong> La renovación al esquema de arrendamiento podrá realizarse siempre que el socio conductor cumpla con las obligaciones establecidas en el contrato de adhesión, cualquier incumplimiento no dará efecto a alguna renovación.
                </Typography>
                <Typography variant="body2" paragraph>
                <strong>Trámites incluidos.</strong> Se refiere únicamente al trámite administrativo de tenencia, verificación y placas de circulación.
                </Typography>
                <Typography variant="body2" paragraph>
                <strong>Tarifa semanal dinámica.</strong> El monto de la renta semanal se calculará en función de la proporción de kilómetros totales recorridos frente a los kilómetros conducidos en la plataforma Uber. Esto determinará la tarifa final de la renta semanal fijada en moneda nacional.
                </Typography>
                <Typography variant="body2" paragraph>
                Información expresada para fines ilustrativos y de comparación.
                </Typography>
                <Typography variant="body2" paragraph>
                Horario y teléfonos de atención lunes a viernes de 09:00 a 13:30 y de 15:00 a 17:30 horas, sábado de 9:00 a 12:30 horas. Comentarios, dudas o sugerencias a los teléfonos 556211-0056 o al correo electrónico contacto@autofinrent.com
                </Typography>
                <Typography variant="body2" paragraph>
                    
                </Typography>
            </Box>
        </Container>
    );
};

export default Legal;
