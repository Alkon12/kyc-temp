'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import useBackofficeLoginModal from '@/client/hooks/useBackofficeLoginModal'

import Modal from './Modal'
import Input from '../inputs/Input'
import Heading from '../Heading'

const BackofficeLoginModal = () => {
  const router = useRouter()
  const loginModal = useBackofficeLoginModal()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    signIn('credentials', {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false)

      if (callback?.ok) {
        toast.success('Bienvenido!')
        router.refresh()
        loginModal.onClose()
      }

      if (callback?.error) {
        toast.error(callback.error)
      }
    })
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Backoffice" subtitle="Ingrese con su cuenta de SmartIT" />
      <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
      <Input
        id="password"
        label="Contraseña"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  )

  const footerContent = <div className="flex flex-col gap-4 mt-3"></div>

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Backoffice"
      primaryActionEnable={true}
      primaryActionLabel="Continua"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default BackofficeLoginModal
