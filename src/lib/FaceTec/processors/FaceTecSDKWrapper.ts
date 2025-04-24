import { Config } from '../../../../public/Config';
import LivenessCheckProcessor from './LivenessCheckProcessor';
import PhotoIDMatchProcessor from './PhotoIDMatchProcessor';

declare const FaceTecSDK: any;

class FaceTecSDKWrapper {
  private onCompleteCallback?: () => void;
  private latestSessionId: string = '';
  private documentImages: string[] = [];

  constructor(onCompleteCallback?: () => void) {
    this.onCompleteCallback = onCompleteCallback;
  }

  public startLivenessSession = (): void => {
    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    this.getSessionToken((sessionToken?: string): void => {
      this.latestSessionId = sessionToken || '';
      // eslint-disable-next-line no-new
      new LivenessCheckProcessor(sessionToken as string, this);
    });
  };

  public startIDScanMatchSession = (): void => {
    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    this.getSessionToken((sessionToken?: string): void => {
      this.latestSessionId = sessionToken || '';
      // eslint-disable-next-line no-new
      new PhotoIDMatchProcessor(sessionToken as string, this);
    });
  };

  public onComplete = (faceTecSessionResult: any, faceTecIDScanResult: any | undefined, _latestNetworkRequestStatus: number):void => {
    console.log("faceTecSessionResult.status: ",faceTecSessionResult.status);

    if (faceTecIDScanResult != null) {
      console.log("faceTecIDScanResult Status: ", faceTecIDScanResult.status);
      
      // Store document images if available
      if (faceTecIDScanResult.frontImagesCompressedBase64) {
        this.documentImages.push(faceTecIDScanResult.frontImagesCompressedBase64);
      }
      
      if (faceTecIDScanResult.backImagesCompressedBase64) {
        this.documentImages.push(faceTecIDScanResult.backImagesCompressedBase64);
      }
    }
    
    // If scan is complete and successful, call the callback
    if (faceTecIDScanResult?.isCompletelyDone && this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  };
  
  /**
   * Get the session ID of the current FaceTec session
   */
  public getSessionId(): string {
    return this.latestSessionId;
  }
  
  /**
   * Get the document images captured during the session
   */
  public getDocumentImages(): string[] {
    return this.documentImages;
  }

  private getSessionToken = (sessionTokenCallback: (sessionToken: string) => void): void => {
    try {
      var XHR = new XMLHttpRequest();
      XHR.open("GET", Config.BaseURL + "/session-token");
      XHR.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
      // XHR.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(""));

      XHR.onreadystatechange = function(): void {
        if (this.readyState === XMLHttpRequest.DONE) {
          var sessionToken = "";

          try {
          // Attempt to get the sessionToken from the response object.
            sessionToken = JSON.parse(this.responseText).sessionToken;

            // Something went wrong in parsing the response. Return an error.
            if (typeof sessionToken !== "string") {
              console.log(XHR.status);
              return;
            }
          }
          catch {
          // Something went wrong in parsing the response. Return an error.
            XHR.abort();
            console.log(XHR.status);
            return;
          }

          sessionTokenCallback(sessionToken);
        }
      };

      XHR.onerror = function(): void {
        XHR.abort();
        console.log(XHR.status);
      };

      XHR.send();
    }
    catch (e) {
      console.log(e);
    }
  };
}

export default FaceTecSDKWrapper; 