'use client'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@styles/globals.css'
import React, { ReactNode } from 'react'
import ClientOnly from '@/components/ClientOnly'
import { ApolloWrapper } from '@app/ApolloWrapper'
import { SessionProvider } from 'next-auth/react'

const DetailtLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ClientOnly>
      <SessionProvider>
        <ApolloWrapper>{children}</ApolloWrapper>
      </SessionProvider>
    </ClientOnly>
  )
}

export default DetailtLayout
