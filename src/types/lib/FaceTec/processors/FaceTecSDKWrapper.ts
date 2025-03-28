import { Config } from '../../../../../public/Config';
import { LivenessCheckProcessor } from './LivenessCheckProcessor';
import { PhotoIDMatchProcessor } from './PhotoIDMatchProcessor';

declare const FaceTecSDK: any;

export class FaceTecSDKWrapper {
  public startLivenessSession = async (): Promise<void> => {
    try {
      const sessionToken = await this.getSessionToken();
      if (sessionToken) {
        new LivenessCheckProcessor(sessionToken, this);
      }
    } catch (error) {
      console.error('Error starting liveness session:', error);
    }
  };

  public startIDScanMatchSession = async (): Promise<void> => {
    try {
      const sessionToken = await this.getSessionToken();
      if (sessionToken) {
        new PhotoIDMatchProcessor(sessionToken, this);
      }
    } catch (error) {
      console.error('Error starting ID scan session:', error);
    }
  };

  public onComplete = (
    faceTecSessionResult: any,
    faceTecIDScanResult: any | undefined,
    latestNetworkRequestStatus: number
  ): void => {
    console.log("Session Complete. Status:", faceTecSessionResult?.status);
    if (faceTecIDScanResult != null) {
      console.log("ID Scan Status:", faceTecIDScanResult.status);
    }
  };

  private getSessionToken = async (): Promise<string | undefined> => {
    try {
      const response = await fetch(`${Config.BaseURL}/session-token`, {
        method: 'GET',
        headers: {
          'X-Device-Key': Config.DeviceKeyIdentifier,
          'X-Token-Authentication': Config.xTokenAuthentication,
        }
      });

      const data = await response.json();
      if (typeof data.sessionToken === 'string') {
        return data.sessionToken;
      }
      console.error('Invalid session token response');
      return undefined;
    } catch (error) {
      console.error('Error getting session token:', error);
      return undefined;
    }
  };
}