'use client'

import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CREATE_LEAD = gql`
  mutation CreateLead($input: CreateLeadInput!) {
    createLead(input: $input)
  }
`

interface VisitAppointmentFormProps {
    onLoading?: () => void
    onClose: () => void
}

const VisitAppointmentForm: React.FC<VisitAppointmentFormProps> = ({ onClose, onLoading }) => {

    const router = useRouter()
    const [mutateFunction, { data, loading, error }] = useMutation(CREATE_LEAD)
    const [termsAccepted, setTermsAccepted] = useState({ terms: false, privacy: false })
    
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData: FormData = new FormData(e.currentTarget)
        const { firstName, lastName, phoneNumber, email, date, time} = Object.fromEntries(formData)
        let visitAppointmentAt = new Date(`${date} ${time}`)
        console.log("{visitAppointmentAt}",visitAppointmentAt)
        const result = await mutateFunction({
            variables: {
            input: {
                email: email,
                phoneNumber: phoneNumber,
                firstName: firstName,
                lastName: lastName,
                visitAppointmentAt,
            },
            },
        })

        if(!error){
            console.log("{result}", result)
            router.push("/typ")
            //onClose()
        }
    }

    const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'terms') setTermsAccepted({ ...termsAccepted, terms: !termsAccepted.terms })
        else setTermsAccepted({ ...termsAccepted, privacy: !termsAccepted.privacy })
    }



    return(
        <form method='post' onSubmit={e => handleSubmit(e)}>
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Nombre(s)" name="firstName" required />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Apellido(s)" name="lastName" />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Teléfono" name="phoneNumber" required />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control" placeholder="Correo" name="email" />
            </div>
            <div className="row">
                <div className="col-6">
                    <div className="mb-3">
                    <label className="form-label">Fecha</label>
                    <input type="date" id="fecha" className="form-control" name="date" required/>
                    </div>
                </div>
                <div className="col-6">
                    <div className="mb-3">
                    <label className="form-label">Hora</label>
                    <select className="form-select" id="opciones" aria-label="Default select example" name="time">
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>                        
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                    </select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="mb-3">
                <div className="form-check">
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
                <div className="form-check">
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
                </div>
            </div>
            {!loading ? (<button className="btn btn-success w-100" disabled={!termsAccepted.privacy || !termsAccepted.terms}>Enviar</button>) : (<div className="btn btn-success w-100">Enviando...</div>)}
        </form>
    )
}

export default VisitAppointmentForm