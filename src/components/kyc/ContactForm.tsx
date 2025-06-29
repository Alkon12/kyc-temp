"use client"

import React, { useState, useEffect } from 'react';
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
import { useMutation, gql } from '@apollo/client';
import { UPDATE_KYC_PERSON_CONTACT_BY_TOKEN } from '@/app/lib/graphql/mutations';

// Mutación para actualizar el estado del enlace
const UPDATE_VERIFICATION_LINK_STATUS = gql`
  mutation UpdateVerificationLinkStatus($token: String!, $status: String!) {
    updateVerificationLinkStatus(token: $token, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

interface ContactFormProps {
  token: string;
  onSubmit?: (email: string, phoneNumber: string) => void;
  initialEmail?: string;
  initialPhone?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ token, onSubmit, initialEmail, initialPhone }) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{email?: string; phoneNumber?: string}>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Set up GraphQL mutation for contact info
  const [updateContactInfo, { loading }] = useMutation(UPDATE_KYC_PERSON_CONTACT_BY_TOKEN, {
    onCompleted: (data) => {
      console.log('Contact info updated:', data);
      
      // Una vez actualizada la información de contacto, actualizar el estado del enlace
      updateLinkStatus();
    },
    onError: (error) => {
      console.error('Error updating contact info:', error);
      setIsSubmitting(false);
      setErrorMessage(error.message || 'Error al actualizar la información de contacto');
    }
  });
  
  // Set up GraphQL mutation for updating link status
  const [updateStatus] = useMutation(UPDATE_VERIFICATION_LINK_STATUS, {
    onCompleted: (data) => {
      console.log('Link status updated to contact_submitted:', data);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      if (onSubmit) {
        onSubmit(email, phoneNumber);
      }
    },
    onError: (error) => {
      console.error('Error updating link status:', error);
      // No mostramos este error al usuario, ya que la información de contacto se actualizó correctamente
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      if (onSubmit) {
        onSubmit(email, phoneNumber);
      }
    }
  });
  
  // Función para actualizar el estado del enlace
  const updateLinkStatus = () => {
    updateStatus({
      variables: {
        token,
        status: 'contact_submitted'
      }
    });
  };

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
    setErrorMessage(null);
    
    // Submit the data to the GraphQL API
    updateContactInfo({
      variables: {
        token,
        email,
        phone: phoneNumber,
      }
    });
  };

  // Si ya tenemos ambos valores, enviar automáticamente
  useEffect(() => {
    if (initialEmail && initialPhone) {
      handleSubmit(new Event('submit') as any);
    }
  }, [initialEmail, initialPhone]);

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
          Información de contacto
        </CardTitle>
        <CardDescription className="text-gray-600">
          Por favor, proporciona tu información de contacto para continuar con la verificación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        
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
              disabled={!!initialEmail}
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
              disabled={!!initialPhone}
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