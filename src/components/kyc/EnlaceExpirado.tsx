"use client"
import React from "react";

const EnlaceExpirado: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Enlace Expirado</h2>
      </div>
      
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-4">
          Este enlace de verificación ha expirado o no es válido.
        </p>
        <p className="text-gray-600">
          Por favor, póngase en contacto con el remitente para solicitar un nuevo enlace de verificación.
        </p>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500 text-center">
          Si tiene alguna pregunta, por favor contacte a soporte.
        </p>
      </div>
    </div>
  );
};

export default EnlaceExpirado; 