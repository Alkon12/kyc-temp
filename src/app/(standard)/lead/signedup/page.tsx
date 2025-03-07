import React, { FC } from 'react'

export interface DriverSignUpManualOkProps {}

const DriverSignUpManualOk: FC<DriverSignUpManualOkProps> = () => {
  return (
    <>
      <br />
      <div className="contenido">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="border p-3 rounded mb-4 center">
                <br />
                <center>
                  <img src="/images/icono-check.png" className="img-fluid mb-4" alt="Check Icon" />
                </center>
                <p className="lead text-center mb-4">
                  Nos pondremos en contacto usted a la brevedad
                  <br />
                </p>
                {/*
                <div className="row align-items-center">
                  <div className="col-3 offset-2">
                    <div className="px-5">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                          Llamada
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-1">
                    <center>
                      <img src="/images/divisor.png" className="img-fluid" alt="Divider" />
                    </center>
                  </div>
                  <div className="col-3">
                    <div className="px-0">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault2"
                          defaultChecked
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                          WhatsApp
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DriverSignUpManualOk
