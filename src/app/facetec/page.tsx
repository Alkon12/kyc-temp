"use client"
import React from "react";
import { Config } from "../../../public/Config";
import Link from "next/link";
import Script from "next/script";
import { FaceTecSDKWrapper } from "@type/lib/FaceTec/processors/FaceTecSDKWrapper";

// FaceTec SDK is loaded through a script method
declare const FaceTecSDK: any;

class FaceTec extends React.Component {
  // Wrapper with the sample app functionality
  private faceTecSDKWrapper: FaceTecSDKWrapper | null = null;
  private sdkLoaded: boolean = false;
  
  state = {
    status: "Cargando componentes..."
  };

  componentDidMount() {
    console.log("FaceTec componente montado");
    
    // Comunicar con la página padre si estamos en un iframe
    this.notifyParentWindow();
    
    // Escuchar mensajes de la página padre
    this.setupMessageListener();
    
    // Cargar script manualmente para mayor control
    this.loadFaceTecScript();
  }
  
  notifyParentWindow = () => {
    // Verificar si estamos en un iframe
    try {
      if (window.self !== window.top) {
        console.log("Ejecutando en iframe, enviando mensaje al padre");
        // Estamos en un iframe, notificar a la ventana padre
        window.parent.postMessage({ type: "FACETEC_LOADED" }, "*");
      }
    } catch (e) {
      console.log("Error al comunicar con ventana padre:", e);
    }
  };
  
  setupMessageListener = () => {
    window.addEventListener('message', (event) => {
      // Por seguridad deberías verificar el origen en producción
      
      if (event.data && event.data.type === 'CHECK_FACETEC_STATUS') {
        console.log("Recibido mensaje de verificación de estado");
        // Responder con el estado actual
        if (typeof window.parent !== 'undefined') {
          window.parent.postMessage({ 
            type: 'FACETEC_STATUS', 
            initialized: this.sdkLoaded 
          }, '*');
        }
      }
    });
  };
  
  loadFaceTecScript = () => {
    // Crear el elemento script manualmente
    const script = document.createElement('script');
    script.src = "../core-sdk/FaceTecSDK.js/FaceTecSDK.js";
    script.async = true;
    
    script.onload = () => {
      console.log("Script FaceTec cargado manualmente");
      this.setState({ status: "Script cargado, inicializando SDK..." });
      
      // Esperar un momento para que FaceTecSDK esté disponible globalmente
      setTimeout(() => {
        this.initializeSDK();
      }, 500);
    };
    
    script.onerror = (error) => {
      console.error("Error al cargar el script FaceTec:", error);
      this.setState({ status: "Error al cargar FaceTec" });
    };
    
    // Agregar el script al documento
    document.body.appendChild(script);
  };

  initializeSDK = () => {
    if (typeof window === 'undefined' || typeof (window as any).FaceTecSDK === 'undefined') {
      console.error("FaceTecSDK no disponible después de cargar el script");
      this.setState({ status: "Error: SDK no disponible" });
      return;
    }
    
    try {
      const FaceTecSDK = (window as any).FaceTecSDK;
      
      console.log("Configurando directorios de recursos");
      FaceTecSDK.setImagesDirectory("/core-sdk/FaceTec_images");
      FaceTecSDK.setResourceDirectory("/core-sdk/FaceTecSDK.js/resources");
      
      console.log("Inicializando SDK en modo desarrollo");
      FaceTecSDK.initializeInDevelopmentMode(
        Config.DeviceKeyIdentifier, 
        Config.PublicFaceScanEncryptionKey, 
        (success: boolean): void => {
          if (success) {
            console.log("SDK inicializado correctamente");
            this.sdkLoaded = true;
            this.setState({ status: "Iniciando verificación..." });
            
            // Notificar a la ventana padre que FaceTec se inicializó
            if (window.self !== window.top) {
              window.parent.postMessage({ type: "FACETEC_INITIALIZED" }, "*");
            }
            
            // Iniciar el proceso de verificación
            setTimeout(() => this.startVerification(), 500);
          } else {
            console.error("Error al inicializar SDK");
            this.setState({ status: "Error: No se pudo inicializar" });
          }
        }
      );
    } catch (error) {
      console.error("Error durante la inicialización:", error);
      this.setState({ status: "Error: " + String(error) });
    }
  };

  startVerification = () => {
    try {
      console.log("Creando instancia de FaceTecSDKWrapper");
      this.faceTecSDKWrapper = new FaceTecSDKWrapper();
      
      console.log("Iniciando sesión de verificación ID");
      this.faceTecSDKWrapper.startIDScanMatchSession();
    } catch (error) {
      console.error("Error al iniciar verificación:", error);
      this.setState({ status: "Error al iniciar verificación" });
    }
  };

  render(): React.ReactNode {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h3>Verificación de Identidad</h3>
        <p>{this.state.status}</p>
        <Link href="/">Volver al inicio</Link>
      </div>
    );
  }
}

export default FaceTec;