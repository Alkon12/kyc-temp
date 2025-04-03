'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/types/components/ui/button'
import { Icons } from '@/components/icons'
import { navigationItems } from '@/config/dashboard'

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean | undefined;
  toggleSidebar: () => void;
  toggleCollapsed: () => void;
}

export function Sidebar({ 
  isOpen, 
  isCollapsed, 
  isMobile, 
  toggleSidebar, 
  toggleCollapsed 
}: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
    {
      "translate-x-0": isOpen,
      "-translate-x-full": !isOpen,
      "w-[70px]": isCollapsed && !isMobile,
      "w-64": !isCollapsed || isMobile,
    }
  )

  const shouldShowFullContent = !isCollapsed || isMobile
  const isButtonCollapsed = isCollapsed && !isMobile

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 h-14 border-b">
          <div className="flex items-center overflow-hidden">
            <Icons.logo className="h-6 w-6 flex-shrink-0" />
            {shouldShowFullContent && (
              <span className="ml-2 font-medium text-lg truncate">KYC Service</span>
            )}
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleCollapsed}
              className="hidden lg:flex"
              title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {isCollapsed ? (
                <Icons.panelRight className="h-4 w-4" />
              ) : (
                <Icons.panelLeft className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isCollapsed ? "Expandir menú" : "Colapsar menú"}
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <Icons.close className="h-4 w-4" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const Icon = Icons[item.icon as keyof typeof Icons]
              const isActive = pathname === item.href
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href as any}
                    className={cn(
                      'flex items-center rounded-md py-2 transition-colors',
                      isButtonCollapsed ? 'justify-center px-2' : 'px-3',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    title={item.name}
                    onClick={() => {
                      // Close sidebar on mobile when a link is clicked
                      if (isMobile) {
                        toggleSidebar()
                      }
                    }}
                  >
                    <Icon className={cn("h-5 w-5", shouldShowFullContent && 'mr-3')} />
                    {shouldShowFullContent && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        <div className="mt-auto border-t p-4">
          {/* User profile section */}
          {session?.user && shouldShowFullContent && (
            <div className="mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.user.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email || ''}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isButtonCollapsed ? (
            <Button 
              variant="ghost" 
              size="icon"
              className="w-full h-9 flex justify-center" 
              onClick={handleSignOut}
              title="Cerrar sesión"
            >
              <Icons.logout className="h-5 w-5" />
              <span className="sr-only">Cerrar sesión</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full" 
              onClick={handleSignOut}
            >
              <Icons.logout className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          )}
        </div>
      </div>
    </>
  )
} 