import React, { FC, useEffect } from 'react'

export interface ApplicationCreatedOkProps {
  flowStatus: string
}

const ApplicationCreatedOk: FC<ApplicationCreatedOkProps> = ({ flowStatus }) => {
  const appUrlIos = 'https://apps.apple.com/mx/app/autofin-rent/id6560118036'
  const appUrlAndroid = 'https://example.com/app-android'

  useEffect(() => {
    const sendNotification = async () => {
      try {
        const response = await fetch('/api/v1/docs/chatgmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })

        if (response.ok) {
          sessionStorage.setItem('notificationSent', 'true')
        } else {
          console.error('Failed to send notification')
        }
      } catch (error) {
        console.error('Failed to fetch:', error)
      }
    }

    const hasNotificationBeenSent = sessionStorage.getItem('notificationSent')
    if (!hasNotificationBeenSent) {
      sendNotification()
    }
  }, [])

  return (
    <div>
      <div className="container">
        <p className="d-none d-md-block lead text-center mb-4">
          <strong>Por favor escanea el código QR con tu Smartphone</strong>
          <br />
          para continuar en nuestra app
        </p>

        <div className="row">
          <div className="col-lg-4 offset-lg-4">
            <div className="d-none d-md-block border p-3 rounded mb-4">
              <center className="qr-page">
                <img src="/images/qr.png" className="img-fluid rounded" alt="Código QR" />
              </center>
            </div>

            <div className="tarjeta-precio m-5">
              <p className="d-none d-md-block text-white text-center py-2">
                <strong>¿No tienes un lector de QR?</strong>
              </p>
              <p className="text-white text-center py-2">Descarga nuestra APP en:</p>
              <div className="d-flex flex-column align-items-center gap-4">
                <a href={appUrlAndroid}>
                  <img src="/images/google-play.png" className="img-fluid" alt="Google Play" />
                </a>
                <a href={appUrlIos}>
                  <img src="/images/appstore.png" className="img-fluid" alt="App Store" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationCreatedOk
