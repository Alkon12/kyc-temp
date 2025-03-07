'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { TbBrandUber } from 'react-icons/tb'
import { Modal as BootstrapModal } from 'bootstrap'
import DriverSignUpManual from '../DriverSignUpManual/DriverSignUpManual'
import { ApolloPublicWrapper } from '@app/ApolloPublicWrapper'
import 'bootstrap/dist/css/bootstrap.min.css'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState({ terms: false, privacy: false })
  const [showDriverSignUp, setShowDriverSignUp] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let modalInstance: BootstrapModal | null = null

    const loadBootstrap = async () => {
      await import('bootstrap/dist/js/bootstrap.bundle.min')
      if (modalRef.current) {
        modalInstance = new BootstrapModal(modalRef.current, {
          backdrop: 'static',
          keyboard: true,
        })

        const handleHidden = () => {
          onClose()
        }

        modalRef.current.addEventListener('hidden.bs.modal', handleHidden)

        if (isOpen) {
          modalInstance.show()
        } else {
          modalInstance.hide()
        }

        return () => {
          modalInstance?.hide()
          modalInstance?.dispose()
          modalRef.current?.removeEventListener('hidden.bs.modal', handleHidden)
        }
      }
      return undefined
    }

    loadBootstrap()

    return () => {
      modalInstance?.hide()
      modalInstance?.dispose()
    }
  }, [isOpen, onClose])

  const handleClose = () => {
    if (modalRef.current) {
      const modalInstance = BootstrapModal.getInstance(modalRef.current)
      modalInstance?.hide()
    }
  }

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'terms') setTermsAccepted({ ...termsAccepted, terms: !termsAccepted.terms })
    else setTermsAccepted({ ...termsAccepted, privacy: !termsAccepted.privacy })
  }

  const handlePhoneSignUpClick = () => {
    setShowDriverSignUp(true)
  }

  const openChatwootBubble = () => {
    console.log('test')

    // window.$chatwoot.setCustomAttributes({
    //   accountId: 1,
    //   pricingPlan: "paid",
    
    //   // Here the key which is already defined in custom attribute
    //   // Value should be based on type (Currently support Number, Date, String and Number)
    // });

    window.$chatwoot.toggle("open");
  }


  const handleBackClick = () => {
    setShowDriverSignUp(false)
  }

  const bodyContent = showDriverSignUp ? (
    <div>
      <DriverSignUpManual onClose={handleClose} onLoading={setIsLoading} />
      <button
        className="btn btn-secondary mt-3"
        onClick={handleBackClick}
        style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }}
      >
        Atrás
      </button>
    </div>
  ) : (
    <div className="container">
      <div className="d-flex flex-column gap-4">
        <h5 className="modal-title text-center" id="loginModalLabel">
          Tenemos ofertas para ti
        </h5>
        <p className="text-center ">
          Usa tu cuenta de Uber para ingresar y de ahí podremos obtener los datos de tu actividad en Uber para poder
          brindarte una oferta. Estos datos serán guardados pero no serán compartidos.
        </p>

        <div className="form-check d-flex justify-content-center align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="termsCheck"
            checked={termsAccepted.terms}
            name="terms"
            onChange={handleTermsChange}
          />
          <label className="form-check-label ms-2" htmlFor="termsCheck">
            Acepto los{' '}
            <a href="/termsandConditions" target="_blank" rel="noopener noreferrer">
              términos y condiciones
            </a>
            .
          </label>
        </div>
        <div className="form-check d-flex justify-content-center align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="termsCheck"
            checked={termsAccepted.privacy}
            onChange={handleTermsChange}
          />
          <label className="form-check-label ms-2" htmlFor="termsCheck">
            Acepto el{' '}
            <a href="/noticeofPrivacy" target="_blank" rel="noopener noreferrer">
              aviso de privacidad
            </a>
            .
          </label>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center justify-content-center mb-2"
          onClick={() => signIn('uber', { callbackUrl: '/quote' })}
          disabled={isLoading || !termsAccepted.privacy || !termsAccepted.terms}
          style={{ backgroundColor: '#7BAF45', borderColor: '#7BAF45' }}
        >
          <TbBrandUber className="me-2" />
          Continue con su cuenta de Uber
        </button>

        <button
          className="btn btn-primary d-flex align-items-center justify-content-center mb-2"
          onClick={openChatwootBubble}
          disabled={isLoading || !termsAccepted.privacy || !termsAccepted.terms}
          style={{ backgroundColor: '#7BAF45', borderColor: '#7BAF45' }}
        >
          <TbBrandUber className="me-2" />
          Continue con su Telefono o Correo
        </button>
      </div>
    </div>
  )

  return (
    <ApolloPublicWrapper>
      <div
        ref={modalRef}
        className="modal fade"
        id="loginModal"
        tabIndex={-1}
        aria-labelledby="loginModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">{bodyContent}</div>
          </div>
        </div>
      </div>
    </ApolloPublicWrapper>
  )
}

export default LoginModal
