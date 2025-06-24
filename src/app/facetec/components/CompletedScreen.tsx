import { Icons } from "@/components/icons";

interface CompletedScreenProps {
  verificationType: string;
  redirectUrl?: string;
}

export const CompletedScreen: React.FC<CompletedScreenProps> = ({ 
  verificationType, 
  redirectUrl 
}) => (
  <div className="max-w-md mx-auto">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Verificación Completa!</h2>
      <p className="text-gray-600 mb-4">
        Tu proceso de verificación ha sido completado exitosamente.
      </p>
      <p className="text-gray-500 text-sm mb-4">
        Nivel de verificación: <span className="font-semibold">{verificationType.toUpperCase()}</span>
      </p>
      {redirectUrl && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center mb-2">
            <Icons.spinner className="h-4 w-4 text-blue-500 animate-spin mr-2" />
            <span className="text-blue-700 font-medium">Redirigiendo automáticamente...</span>
          </div>
          <p className="text-blue-600 text-sm">
            Te redirigiremos automáticamente en unos segundos.
          </p>
        </div>
      )}
    </div>
  </div>
); 