'use client'

import { useState, useEffect } from 'react'

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  isMobile: boolean | undefined
  toggleSidebar: () => void
  toggleCollapsed: () => void
}

export function useSidebar(): SidebarState {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const checkScreenSize = () => {
      const isDesktopView = window.innerWidth >= 1024
      setIsMobile(!isDesktopView)
      
      if (isDesktopView) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
        if (isCollapsed) {
          setIsCollapsed(false)
        }
      }
    }

    checkScreenSize()

    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [isCollapsed])

  useEffect(() => {
    if (!isMounted) return;
    
    if (isMobile && isOpen && isCollapsed) {
      setIsCollapsed(false)
    }
  }, [isOpen, isCollapsed, isMobile, isMounted])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  return {
    isOpen,
    isCollapsed,
    isMobile,
    toggleSidebar,
    toggleCollapsed
  }
} 