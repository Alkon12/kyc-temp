'use client'

import React, { ReactNode } from 'react'
import ClientOnly from '@/components/ClientOnly'
import { ApolloPublicWrapper } from '@app/ApolloPublicWrapper'

const InvitationLandingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ClientOnly>
      <ApolloPublicWrapper>{children}</ApolloPublicWrapper>
    </ClientOnly>
  )
}

export default InvitationLandingLayout
