"use client"
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/types/components/ui/card";
import { Button } from "@/types/components/ui/button";
import { Alert, AlertDescription } from "@/types/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface TerminosCondicionesProps {
  onAceptar: () => void;
  onRechazar: () => void;
  companyName: string;
  firstName: string;
  redirectUrl: string;
}

const TerminosCondiciones: React.FC<TerminosCondicionesProps> = ({ 
  onAceptar, 
  onRechazar,
  companyName,
  firstName,
  redirectUrl
}) => {
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <span className="text-3xl">😊</span>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Bienvenido a {companyName} {redirectUrl}
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-muted-foreground">
            Hola {firstName}, durante este proceso realizaremos la verificación de tu identidad.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Puedes consultar los detalles del proceso en nuestro{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                disclaimer
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-6 text-sm">
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Aviso de Privacidad y Consentimiento para el Proceso de Identificación (KYC) y
                Firma Electrónica de Documentos
              </h3>

              <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                <section>
                  <h4 className="font-semibold text-gray-800">1. Responsable del Tratamiento de Datos Personales:</h4>
                  <p className="text-gray-600 mt-2">
                    {companyName}, con domicilio en [dirección completa], es responsable
                    del tratamiento de sus datos personales conforme a lo establecido en la Ley
                    Federal de Protección de Datos Personales en Posesión de los Particulares
                    (LFPDPPP).
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-800">2. Finalidad del Tratamiento de Datos:</h4>
                  <p className="text-gray-600 mt-2">Los datos personales y biométricos que usted proporcione serán utilizados para:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                    <li>Verificar su identidad en cumplimiento de procesos de Know Your Customer (KYC).</li>
                    <li>Consultar y validar información en bases de datos oficiales del gobierno mexicano.</li>
                    <li>Capturar y almacenar datos biométricos de forma temporal y segura.</li>
                    <li>Evaluar su historial crediticio cuando sea necesario.</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-800">3. Derechos ARCO:</h4>
                  <p className="text-gray-600 mt-2">
                    Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de
                    sus datos personales (Derechos ARCO). Para ejercer estos derechos, puede
                    contactarnos en [correo electrónico o número de contacto].
                  </p>
                </section>
              </div>
            </section>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-4 pt-6">
          <Button
            onClick={onAceptar}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Acepto los términos y condiciones
          </Button>
          <Button
            onClick={onRechazar}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            NO acepto los términos y condiciones
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TerminosCondiciones; 