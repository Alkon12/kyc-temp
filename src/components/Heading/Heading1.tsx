import React, { HTMLAttributes, ReactNode } from 'react'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string
  desc?: ReactNode
  isCenter?: boolean
}

const Heading1: React.FC<HeadingProps> = ({
  children,
  desc = '',
  className = 'mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white',
  isCenter = false,
  ...args
}) => {
  return (
    <div className={`nc-Section-Heading relative flex flex-col sm:flex-row sm:items-end justify-between ${className}`}>
      <div className={isCenter ? 'text-center w-full max-w-2xl mx-auto ' : 'max-w-2xl'}>
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-semibold`} {...args}>
          {children || `Section Heading`}
        </h2>
        {desc && (
          <span className="mt-2 md:mt-3 font-normal block text-base sm:text-xl text-neutral-500 dark:text-neutral-400">
            {desc}
          </span>
        )}
      </div>
    </div>
  )
}

export default Heading1
