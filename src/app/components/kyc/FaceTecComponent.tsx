"use client"
import React, { forwardRef, useImperativeHandle } from "react";
import { Config } from "../../../../public/Config";
import { FaceTecSDKWrapper } from "@type/lib/FaceTec/processors/FaceTecSDKWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/types/components/ui/card";
import { Progress } from "@/types/components/ui/progress";
import { Loader2 } from "lucide-react";

// FaceTec SDK is loaded through a script method
declare const FaceTecSDK: any;

interface FaceTecComponentProps {
  onComplete?: () => void;
  onError?: (error: string) => void;
  shouldStartVerification?: boolean;
}

interface FaceTecRef {
  isSDKLoaded: () => boolean;
  startVerification: () => void;
}

interface FaceTecState {
  status: string;
  progress: number;
}

class FaceTecComponentClass extends React.Component<FaceTecComponentProps, FaceTecState> {
  private faceTecSDKWrapper: FaceTecSDKWrapper | null = null;
  private sdkLoaded: boolean = false;
  private hasStartedVerification: boolean = false;
  
  state: FaceTecState = {
    status: "Cargando componentes...",
    progress: 0
  };

  componentDidMount() {
    console.log("FaceTec componente montado");
    this.setState({ progress: 10 });
    this.loadFaceTecScript();
  }

  componentDidUpdate(prevProps: FaceTecComponentProps) {
    if (
      this.sdkLoaded && 
      !prevProps.shouldStartVerification && 
      this.props.shouldStartVerification &&
      !this.hasStartedVerification
    ) {
      this.startVerification();
    }
  }
  
  loadFaceTecScript = () => {
    const script = document.createElement('script');
    script.src = "../core-sdk/FaceTecSDK.js/FaceTecSDK.js";
    script.async = true;
    
    script.onload = () => {
      console.log("Script FaceTec cargado manualmente");
      this.setState({ 
        status: "Script cargado, inicializando SDK...",
        progress: 30 
      });
      
      setTimeout(() => {
        this.initializeSDK();
      }, 500);
    };
    
    script.onerror = (error) => {
      console.error("Error al cargar el script FaceTec:", error);
      this.setState({ status: "Error al cargar FaceTec", progress: 0 });
      this.props.onError?.("Error al cargar FaceTec");
    };
    
    document.body.appendChild(script);
  };

  initializeSDK = () => {
    if (typeof window === 'undefined' || typeof (window as any).FaceTecSDK === 'undefined') {
      const error = "FaceTecSDK no disponible después de cargar el script";
      console.error(error);
      this.setState({ status: "Error: SDK no disponible", progress: 0 });
      this.props.onError?.(error);
      return;
    }
    
    try {
      const FaceTecSDK = (window as any).FaceTecSDK;
      
      console.log("Configurando directorios de recursos");
      this.setState({ progress: 50 });
      FaceTecSDK.setImagesDirectory("/core-sdk/FaceTec_images");
      FaceTecSDK.setResourceDirectory("/core-sdk/FaceTecSDK.js/resources");
      
      console.log("Inicializando SDK en modo desarrollo");
      this.setState({ progress: 70 });
      FaceTecSDK.initializeInDevelopmentMode(
        Config.DeviceKeyIdentifier, 
        Config.PublicFaceScanEncryptionKey, 
        (success: boolean): void => {
          if (success) {
            console.log("SDK inicializado correctamente");
            this.sdkLoaded = true;
            this.setState({ 
              status: "SDK inicializado y listo",
              progress: 100
            });
            
            if (this.props.shouldStartVerification && !this.hasStartedVerification) {
              this.startVerification();
            }
          } else {
            const error = "Error al inicializar SDK";
            console.error(error);
            this.setState({ 
              status: "Error: No se pudo inicializar",
              progress: 0
            });
            this.props.onError?.(error);
          }
        }
      );
    } catch (error) {
      console.error("Error durante la inicialización:", error);
      this.setState({ 
        status: "Error: " + String(error),
        progress: 0
      });
      this.props.onError?.(String(error));
    }
  };

  startVerification = () => {
    if (!this.sdkLoaded) {
      console.warn("Intentando iniciar verificación antes de que el SDK esté listo");
      return;
    }

    if (this.hasStartedVerification) {
      console.warn("La verificación ya ha sido iniciada");
      return;
    }

    try {
      console.log("Creando instancia de FaceTecSDKWrapper");
      this.faceTecSDKWrapper = new FaceTecSDKWrapper();
      
      console.log("Iniciando sesión de verificación ID");
      this.hasStartedVerification = true;
      this.setState({ status: "Iniciando verificación..." });
      this.faceTecSDKWrapper.startIDScanMatchSession();
    } catch (error) {
      console.error("Error al iniciar verificación:", error);
      this.setState({ status: "Error al iniciar verificación" });
      this.props.onError?.(String(error));
      this.hasStartedVerification = false;
    }
  };

  isSDKLoaded = () => {
    return this.sdkLoaded;
  };

  render(): React.ReactNode {
    const { status, progress } = this.state;
    const isLoading = progress > 0 && progress < 100;

    return (
      <div className="container mx-auto max-w-2xl p-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verificación de Identidad
            </CardTitle>
            <CardDescription className="text-gray-600">
              {status}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isLoading && (
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando componentes...
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}

const FaceTecComponent = forwardRef<FaceTecRef, FaceTecComponentProps>((props, ref) => {
  const componentRef = React.useRef<FaceTecComponentClass>(null);

  useImperativeHandle(ref, () => ({
    isSDKLoaded: () => componentRef.current?.isSDKLoaded() || false,
    startVerification: () => componentRef.current?.startVerification()
  }));

  return <FaceTecComponentClass ref={componentRef} {...props} />;
});

FaceTecComponent.displayName = 'FaceTecComponent';

export default FaceTecComponent; 