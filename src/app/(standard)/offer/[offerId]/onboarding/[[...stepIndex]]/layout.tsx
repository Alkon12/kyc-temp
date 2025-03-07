import React from 'react'
import { FC } from 'react'
import ButtonPrimary from '@/components/ButtonPrimary'
import ButtonSecondary from '@/components/ButtonSecondary'
import { Route } from '@/types/next-route'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@styles/globals.css'
import getCurrentUser from '@/client/actions/getCurrentUser'
import NeedsUberConnect from './NeedsUberConnect'

export interface CommonLayoutProps {
  children: React.ReactNode
  params: {
    offerId: string
    stepIndex: string
  }
}

const CommonLayout: FC<CommonLayoutProps> = async ({ children, params }) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return <NeedsUberConnect />
  }

  const getUrl = (offerId: string, stepIndex: number) => `/offer/${offerId}/onboarding/${stepIndex}`

  const index = Number(params.stepIndex) || 1
  const nextHref = (index < 4 ? getUrl(params.offerId, index + 1) : getUrl(params.offerId, 1)) as Route
  const backtHref = (index > 1 ? getUrl(params.offerId, index - 1) : getUrl(params.offerId, 1)) as Route
  const nextBtnText = index > 3 ? 'Confirmar' : 'Siguiente'

  const showControlButtons = index < 4

  return (
    <div className={`nc-Onboarding1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}>
      <div className="space-y-11">
        {/* <div>
          <span className="text-4xl font-semibold">{index}</span>{" "}
          <span className="text-lg text-neutral-500 dark:text-neutral-400">
            / 4
          </span>
        </div> */}

        <div className="applicationSection__wrap ">{children}</div>

        {showControlButtons && (
          <div className="flex justify-end space-x-5">
            <ButtonSecondary href={backtHref}>Anterior</ButtonSecondary>
            <ButtonPrimary href={nextHref}>{nextBtnText || 'Siguiente'}</ButtonPrimary>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommonLayout
