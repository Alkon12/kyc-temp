declare const FaceTecSDK: any;

//
// This is an example self-contained class to perform Liveness Checks with the FaceTec SDK.
// You may choose to further componentize parts of this in your own Apps based on your specific requirements.
//
export class LivenessCheckProcessor {
  private cancelledDueToNetworkError: boolean;
  public latestNetworkRequest: XMLHttpRequest = new XMLHttpRequest();
  public latestSessionResult: any | null;

  //
  // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
  //
  private success: boolean;
  private sampleAppControllerReference: any;

  constructor(sessionToken: string, sampleAppControllerReference: any) {
    //
    // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
    // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
    //
    this.success = false;
    this.sampleAppControllerReference = sampleAppControllerReference;
    this.latestSessionResult = null;
    this.cancelledDueToNetworkError = false;

    //
    // Part 1:  Starting the FaceTec Session
    //
    // Required parameters:
    // - FaceTecFaceScanProcessor:  A class that implements FaceTecFaceScanProcessor, which handles the FaceScan when the User completes a Session.  In this example, "this" implements the class.
    // - sessionToken:  A valid Session Token you just created by calling your API to get a Session Token from the Server SDK.
    //
    new FaceTecSDK.FaceTecSession(
      this,
      sessionToken
    );
  }

  //
  // Part 2:  Handling the Result of a FaceScan
  //
  public processSessionResultWhileFaceTecSDKWaits = (sessionResult: any, faceScanResultCallback: any): void => {
    this.latestSessionResult = sessionResult;

    if (sessionResult.status !== FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
      this.latestNetworkRequest.abort();
      faceScanResultCallback.cancel();
      return;
    }

    var parameters = {
      faceScan: sessionResult.faceScan,
      auditTrailImage: sessionResult.auditTrail[0],
      lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
      sessionId: sessionResult.sessionId
    };

    this.latestNetworkRequest = new XMLHttpRequest();
    this.latestNetworkRequest.open("POST", "/api/facetec/liveness-3d");
    this.latestNetworkRequest.setRequestHeader("Content-Type", "application/json");
    this.latestNetworkRequest.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(sessionResult.sessionId as string));

    this.latestNetworkRequest.onreadystatechange = (): void => {
      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        try {
          const responseJSON = JSON.parse(this.latestNetworkRequest.responseText);
          const scanResultBlob = responseJSON.scanResultBlob;

          if (responseJSON.wasProcessed === true && responseJSON.error === false) {
            FaceTecSDK.FaceTecCustomization.setOverrideResultScreenSuccessMessage("Face Scanned\n3D Liveness Proven");
            faceScanResultCallback.proceedToNextStep(scanResultBlob);
          }
          else {
            if (responseJSON.error === true && responseJSON.errorMessage != null) {
              this.cancelDueToNetworkError(responseJSON.errorMessage, faceScanResultCallback);
            }
            else {
              this.cancelDueToNetworkError("Unexpected API response, cancelling out.", faceScanResultCallback);
            }
          }
        }
        catch (_e) {
          this.cancelDueToNetworkError("Exception while handling API response, cancelling out.", faceScanResultCallback);
        }
      }
    };

    this.latestNetworkRequest.onerror = (): void => {
      this.cancelDueToNetworkError("XHR error, cancelling.", faceScanResultCallback);
    };

    this.latestNetworkRequest.upload.onprogress = (event: ProgressEvent): void => {
      var progress = event.loaded / event.total;
      faceScanResultCallback.uploadProgress(progress);
    };

    var jsonStringToUpload = JSON.stringify(parameters);
    this.latestNetworkRequest.send(jsonStringToUpload);

    window.setTimeout(() => {
      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        return;
      }
      faceScanResultCallback.uploadMessageOverride("Still Uploading...");
    }, 6000);
  };

  //
  // Part 10:  This function gets called after the FaceTec SDK is completely done.  There are no parameters because you have already been passed all data in the processSessionWhileFaceTecSDKWaits function and have already handled all of your own results.
  //
  public onFaceTecSDKCompletelyDone = (): void => {
    //
    // DEVELOPER NOTE:  onFaceTecSDKCompletelyDone() is called after you signal the FaceTec SDK with success() or cancel().
    // Calling a custom function on the Sample App Controller is done for demonstration purposes to show you that here is where you get control back from the FaceTec SDK.
    //
    this.success = this.latestSessionResult!.isCompletelyDone;

    // Log success message
    if (this.success) {
      console.log("Liveness Confirmed");
    }

    this.sampleAppControllerReference.onComplete(this.latestSessionResult, null, this.latestNetworkRequest.status);
  };

  // Helper function to ensure the session is only cancelled once
  public cancelDueToNetworkError = (networkErrorMessage: string, faceScanResultCallback: any): void => {
    if (this.cancelledDueToNetworkError === false) {
      console.error(networkErrorMessage);
      this.cancelledDueToNetworkError = true;
      faceScanResultCallback.cancel();
    }
  };

  //
  // DEVELOPER NOTE:  This public convenience method is for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In your code, you may not even want or need to do this.
  //
  public isSuccess = (): boolean => {
    return this.success;
  };
}