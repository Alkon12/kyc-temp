'use client'

import React, { FC } from 'react'
import { signIn } from 'next-auth/react'
import { TbBrandUber } from 'react-icons/tb'
import Button from '@/components/MainButton'

export interface NeedsUberConnectProps {}

const NeedsUberConnect: FC<NeedsUberConnectProps> = () => {
  return (
    <>
      <div className={`nc-Onboarding1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}>
        <div className="space-y-11">
          <div className="applicationSection__wrap ">
            <Button
              outline
              label="Tu cuenta de Uber"
              icon={TbBrandUber}
              onClick={() => signIn('uber', { callbackUrl: '/onboarding/4' })}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default NeedsUberConnect
