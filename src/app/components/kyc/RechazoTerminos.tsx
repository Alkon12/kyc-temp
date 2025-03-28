"use client"
import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/types/components/ui/card";
import { Button } from "@/types/components/ui/button";
import { Alert, AlertDescription } from "@/types/components/ui/alert";
import { AlertCircle } from "lucide-react";

const RechazoTerminos: React.FC = () => {
  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <span className="text-3xl">😊</span>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Bienvenidos a AutofinRent
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Lamentamos que no estés de acuerdo con los términos y condiciones.
              Un asistente de ventas se pondrá en contacto contigo para poder definir los próximos pasos.
            </AlertDescription>
          </Alert>

          <div className="text-center text-gray-600">
            Muchas gracias
          </div>

          <div className="text-center text-sm text-gray-500">
            Autofin 2025 - Todos los derechos reservados
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/" passHref>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              Volver al inicio
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RechazoTerminos; 