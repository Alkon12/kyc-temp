import React, { FC, Suspense } from 'react'
import getCurrentUser from '@/client/actions/getCurrentUser'
import Quote from './Quote'

export interface Props {}

const HomePage: FC<Props> = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return false
  }
  return <Quote currentUser={currentUser} />
}

export default HomePage
