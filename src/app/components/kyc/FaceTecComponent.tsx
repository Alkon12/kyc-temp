"use client"
import React, { forwardRef, useImperativeHandle } from "react";
import { Config } from "../../../../public/Config";
import FaceTecSDKWrapper from "@type/lib/FaceTec/processors/FaceTecSDKWrapper";
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
  scanComplete: boolean;
}

class FaceTecComponentClass extends React.Component<FaceTecComponentProps, FaceTecState> {
  private faceTecSDKWrapper: FaceTecSDKWrapper | null = null;
  private sdkLoaded: boolean = false;
  private hasStartedVerification: boolean = false;
  
  state: FaceTecState = {
    status: "Cargando componentes...",
    progress: 0,
    scanComplete: false
  };

  componentDidMount() {
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
    script.src = "/core-sdk/FaceTecSDK.js/FaceTecSDK.js";
    script.async = true;
    
    script.onload = () => {
      this.setState({ 
        status: "Script cargado, inicializando SDK...",
        progress: 30 
      });
      
      setTimeout(() => {
        this.initializeSDK();
      }, 1000);
    };
    
    script.onerror = () => {
      this.setState({ status: "Cargando componentes...", progress: 0 });
    };
    
    document.body.appendChild(script);
  };

  initializeSDK = () => {
    try {
      const FaceTecSDK = (window as any).FaceTecSDK;
      
      this.setState({ progress: 50 });
      FaceTecSDK.setImagesDirectory("/core-sdk/FaceTec_images");
      FaceTecSDK.setResourceDirectory("/core-sdk/FaceTecSDK.js/resources");
      
      this.setState({ progress: 70 });
      FaceTecSDK.initializeInDevelopmentMode(
        Config.DeviceKeyIdentifier, 
        Config.PublicFaceScanEncryptionKey, 
        (success: boolean): void => {
          if (success) {
            this.sdkLoaded = true;
            this.setState({ 
              status: "SDK inicializado y listo",
              progress: 100
            });
            
            if (this.props.shouldStartVerification && !this.hasStartedVerification) {
              setTimeout(() => this.startVerification(), 500);
            }
          } else {
            this.setState({ 
              status: "Cargando componentes...",
              progress: 0
            });
          }
        }
      );
    } catch (error) {
      this.setState({ 
        status: "Cargando componentes...",
        progress: 0
      });
    }
  };

  handleScanComplete = () => {
    this.setState({ scanComplete: true });
    if (this.props.onComplete) {
      this.props.onComplete();
    }
  };

  startVerification = () => {
    try {
      this.faceTecSDKWrapper = new FaceTecSDKWrapper(this.handleScanComplete);
      this.hasStartedVerification = true;
      this.setState({ status: "Iniciando verificación..." });
      this.faceTecSDKWrapper.startIDScanMatchSession();
    } catch (error) {
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