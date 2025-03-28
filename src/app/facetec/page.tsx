"use client"
import React, { useState, useRef } from "react";
import TerminosCondiciones from "../components/kyc/TerminosCondiciones";
import FaceTecComponent from "../components/kyc/FaceTecComponent";
import RechazoTerminos from "../components/kyc/RechazoTerminos";

const FaceTecPage: React.FC = () => {
  const [step, setStep] = useState<'terminos' | 'verificacion' | 'rechazo'>('terminos');
  const [error, setError] = useState<string | null>(null);
  const faceTecRef = useRef<any>(null);

  const handleAceptarTerminos = () => {
    setStep('verificacion');
  };

  const handleRechazarTerminos = () => {
    setStep('rechazo');
  };

  const handleError = (error: string) => {
    setError(error);
    console.error('Error en la verificación:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* FaceTec siempre se monta pero oculto hasta que se acepten los términos */}
      <div style={{ display: step === 'verificacion' ? 'block' : 'none' }}>
        <FaceTecComponent
          onError={handleError}
          ref={faceTecRef}
          shouldStartVerification={step === 'verificacion'}
        />
      </div>

      {step === 'terminos' && (
        <TerminosCondiciones
          onAceptar={handleAceptarTerminos}
          onRechazar={handleRechazarTerminos}
        />
      )}

      {step === 'rechazo' && (
        <RechazoTerminos />
      )}
    </div>
  );
};

export default FaceTecPage;