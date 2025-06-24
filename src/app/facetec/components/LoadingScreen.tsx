import { Icons } from "@/components/icons";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Procesando datos..." }) => (
  <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
    <div className="flex flex-col items-center justify-center space-y-4">
      <Icons.spinner className="h-8 w-8 text-primary animate-spin" />
      <div className="text-xl text-gray-700">{message}</div>
    </div>
  </div>
); 