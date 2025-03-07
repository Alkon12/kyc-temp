import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = 'w-24' }) => {
  return (
    <Link href="/" className={`ttnc-logo inline-block text-primary-6000 focus:outline-none focus:ring-0 ${className}`}>
      <Image
        priority
        className="block cursor-pointer md:hidden"
        src="/images/Logo_New-Photoroom.png"
        height="40"
        width="120"
        alt="Logo"
        sizes="(max-width: 767px) 120px"
      />
      <Image
        className="hidden md:block cursor-pointer"
        src="/images/Logo_New-Photoroom.png"
        height="60"
        width="200"
        alt="Logo"
        sizes="(min-width: 768px) 200px"
      />
    </Link>
  )
}

export default Logo
