import React, { FC } from 'react'
import Textarea from '@/components/Textarea'
import { IUser } from '@type/IUser'
import { IOffer } from '@type/IOffer'

export interface OnboardingStep3Props {
  currentUser: IUser
  offer: IOffer
}

const OnboardingStep3: FC<OnboardingStep3Props> = () => {
  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Detalles adicionales</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Los tendremos en cuenta al momento de analizar la solicitud
        </span>
      </div>

      <Textarea placeholder="..." rows={14} />
    </>
  )
}

export default OnboardingStep3
