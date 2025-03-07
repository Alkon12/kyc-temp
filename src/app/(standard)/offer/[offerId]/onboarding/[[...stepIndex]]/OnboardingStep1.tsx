'use client'
import { IOffer } from '@type/IOffer'
import { IUser } from '@type/IUser'
import React, { FC } from 'react'

export interface OnboardingStep1Props {
  currentUser: IUser
  offer: IOffer
}

const OnboardingStep1: FC<OnboardingStep1Props> = ({ offer, currentUser }: OnboardingStep1Props) => {
  return (
    <h2 className="text-2xl font-semibold">
      ✅ {currentUser.firstName} vamos por tu {offer.product.brand}!
    </h2>
  )
}

export default OnboardingStep1
