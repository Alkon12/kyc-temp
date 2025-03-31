"use client"

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/types/components/ui/card";
import { Input } from "@/types/components/ui/input";
import { Label } from "@/types/components/ui/label";
import { Button } from "@/types/components/ui/button";
import { Loader2 } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

interface ContactFormProps {
  onSubmit?: (email: string, phoneNumber: string) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{email?: string; phoneNumber?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; phoneNumber?: string} = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico es inválido';
      isValid = false;
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'El número de teléfono es requerido';
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'El número de teléfono debe tener 10 dígitos';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(email, phoneNumber);
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            ¡Gracias!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Tu información ha sido recibida correctamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Verificación completa
        </CardTitle>
        <CardDescription className="text-gray-600">
          Por favor, proporciona tu información de contacto para completar el proceso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Número de teléfono</Label>
            <Input 
              id="phone"
              type="tel" 
              placeholder="10 dígitos"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : "Enviar información"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm; 