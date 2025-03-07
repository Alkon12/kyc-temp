import React, { FC } from 'react'
import getCurrentUser from '@/client/actions/getCurrentUser'
import ClientOnly from '@/components/ClientOnly'
import Wizard from './Wizard'

interface Props {
  params: {
    offerId: string
    stepIndex: string
  }
}

const OnboardingPage: FC<Props> = async ({ params }: Props) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return <h2>Usuario no logueado (PAGE)</h2>
  }

  return (
    <ClientOnly>
      <Wizard currentUser={currentUser} offerId={params.offerId} stepIndex={params.stepIndex} />
    </ClientOnly>
  )
}

export default OnboardingPage
