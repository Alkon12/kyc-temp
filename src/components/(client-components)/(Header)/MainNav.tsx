'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IUser } from '@/types/IUser'
import { ButtonCloseShared } from '@app/(standard)/components/ButtonCloseShared'
import JoinUsButton from '@app/(standard)/components/JoinUsButton'

export interface Props {
  currentUser?: IUser | null
  onLoginClick: () => void
}

const MainNav: React.FC<Props> = ({ currentUser, onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleNavLinkClick = () => {
      setIsNavCollapsed(true)
    }

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link')
    navLinks.forEach((link) => {
      link.addEventListener('click', handleNavLinkClick)
    })

    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener('click', handleNavLinkClick)
      })
    }
  }, [pathname])

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed)
  }

  const isHomePage = pathname === '/'

  const navbarClass = isHomePage ? (isScrolled ? 'bg-rent' : 'bg-rent') : 'bg-rent'

  return (
    <nav id="header" className={`navbar navbar-expand-lg navbar-light ${navbarClass} sticky-top`}>
      <div className="container py-3">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand">
            <Image
              src="/images/autofinrent-logo.svg"
              className="img-fluid logo-header"
              width={200}
              height={100}
              alt="Logo"
            />
          </a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNav}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/#somos" legacyBehavior>
                <a className="nav-link text-white" aria-current="page">
                  SOMOS
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/#incluye" legacyBehavior>
                <a className="nav-link text-white">LA RENTA INCLUYE</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/#tarifa" legacyBehavior>
                <a className="nav-link text-white">TARIFA SEMANAL DINÁMICA</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/#contrata" legacyBehavior>
                <a className="nav-link text-white">¡CONTRATA YA!</a>
              </Link>
            </li>
          </ul>
          {currentUser ? (
            <div onClick={() => signOut({ callbackUrl: '/' })}>
              <ButtonCloseShared />
            </div>
          ) : (
            <JoinUsButton onClick={onLoginClick} />
          )}
        </div>
      </div>
    </nav>
  )
}

export default MainNav
