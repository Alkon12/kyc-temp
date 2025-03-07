'use client'

import React, { ReactNode } from 'react'
import ClientOnly from '@/components/ClientOnly'
import { ApolloWrapper } from '@app/ApolloWrapper'
import { SessionProvider } from 'next-auth/react'

const InvitationProcessLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ClientOnly>
      <SessionProvider>
        <ApolloWrapper>{children}</ApolloWrapper>
      </SessionProvider>
    </ClientOnly>
  )
}

export default InvitationProcessLayout
