'use client'

import React from 'react'
import { useState } from 'react'
import { ApolloPublicWrapper } from '@app/ApolloPublicWrapper'
import VisitAppointmentForm from './VisitAppointmentForm'

interface VisitAppointmentModalProps {
    isOpen?: boolean
    onClose: () => void
}

const VisitAppointmentModal: React.FC<VisitAppointmentModalProps> = ({ isOpen, onClose }) => {

    

    return(
        <ApolloPublicWrapper>
            <div className={`modal fade ${isOpen ? "show d-block" : ""}`} id="exampleModal" tabIndex={-1} aria-labelledby="visitAppointmentModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <h5 className="modal-title" id="visitAppointmentModalLabel">Déjanos tus Datos</h5>
                                <button type="button" onClick={onClose} className="bg-transparent border-0 p-0" aria-label="Close">
                                    <span aria-hidden="true" className='text-secondary hover-text-dark font-weight-bold fs-3'>&times;</span>
                                </button>
                            </div>
                        </div>
                        <div className="modal-body py-4">
                            <VisitAppointmentForm onClose={onClose} />
                        </div>
                    </div>
                </div>
            </div>
        </ApolloPublicWrapper>
    )
}

export default VisitAppointmentModal