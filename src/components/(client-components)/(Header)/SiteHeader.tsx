'use client'

import React, { useRef, useState } from 'react'
import { IUser } from '@/types/IUser'
import Header from './Header'
import dynamic from 'next/dynamic'
import ChatwootLoader from '../ChatwootLoader'

const LoginModal = dynamic(() => import('../../modals/LoginModal'), { ssr: false })

export type ChatInstanceType = 'No tengo usuario Uber' | 'Soy Uber, quiero un auto nuevo' | 'Cómo va mi solicitud?'

interface Props {
  currentUser?: IUser | null
}

declare global {
  interface Window {
    chatwootSDK: any
  }
}

const SiteHeader: React.FC<Props> = ({ currentUser }) => {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = () => {
    setIsModalOpen(true)
    document.body.classList.add('modal-open')
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    document.body.classList.remove('modal-open')
  }

  return (
    <>
      <Header
        className="shadow-sm dark:border-b dark:border-neutral-700"
        currentUser={currentUser}
        onLoginClick={handleModalOpen}
      />
      <div ref={anchorRef} className="h-1 absolute invisible"></div>
      <LoginModal isOpen={isModalOpen} onClose={handleModalClose} />
      <ChatwootLoader />
    </>
  )
}

export default SiteHeader
