'use client'

import React, { useState, useEffect } from 'react'
// import { ApolloProvider } from "@apollo/client";
// import apolloClient from '../client/providers/ApolloClient';

interface ClientOnlyProps {
  children: React.ReactNode
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) return null

  return (
    <>
      {/* <ApolloProvider client={apolloClient}> */}
      {children}
      {/* </ApolloProvider> */}
    </>
  )
}

export default ClientOnly
