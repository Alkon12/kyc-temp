import React, { FC } from 'react'

export interface OkmBadgeProps {
  className?: string
  desc?: string
}

const OkmBadge: FC<OkmBadgeProps> = ({ className = '', desc = '0Km!' }) => {
  return (
    <div
      className={`nc-OkmBadge flex items-center justify-center text-xs py-0.5 px-3 bg-green-700 text-red-50 rounded-full ${className}`}
      data-nc-id="OkmBadge"
    >
      {desc}
    </div>
  )
}

export default OkmBadge
