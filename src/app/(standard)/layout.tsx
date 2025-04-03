'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { MobileHeader } from '@/components/dashboard/MobileHeader'
import { useSidebar } from '@/hooks/use-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Control de hidratación para evitar errores de SSR
  const [isMounted, setIsMounted] = useState(false)
  
  // Usando nuestro hook personalizado para toda la lógica del sidebar
  const { 
    isOpen, 
    isCollapsed, 
    isMobile, 
    toggleSidebar, 
    toggleCollapsed 
  } = useSidebar()

  // Efecto para manejar el montaje del componente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevenir errores de hidratación
  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background/50 backdrop-blur-[2px]">
      {/* Sidebar con todas las propiedades necesarias */}
      <Sidebar 
        isOpen={isOpen} 
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        toggleCollapsed={toggleCollapsed}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header móvil como componente separado */}
        <MobileHeader toggleSidebar={toggleSidebar} />
        
        {/* Área de contenido */}
        <div className="px-4 py-4 pt-2 md:px-6 lg:px-8 lg:py-6">
          {children}
        </div>
      </main>
    </div>
  )
} 