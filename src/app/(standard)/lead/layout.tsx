import 'bootstrap/dist/css/bootstrap.min.css'
import '@styles/globals.css'
import React from 'react'
import { FC } from 'react'

export interface LeadLayoutProps {
  children: React.ReactNode
  params: {}
}

const LeadLayout: FC<LeadLayoutProps> = async ({ children, params }) => {
  return (
    <div className={`nc-Onboarding1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}>
      <div className="space-y-11">
        <div className="applicationSection__wrap ">{children}</div>
      </div>
    </div>
  )
}

export default LeadLayout
