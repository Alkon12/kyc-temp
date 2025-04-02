'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/types/components/ui/button'
import { Card } from '@/types/components/ui/card'
import { Icons } from '@/components/icons'

// Define navigation items
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: 'dashboard',
  },
  {
    name: 'Usuarios',
    href: '/users',
    icon: 'users',
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: 'settings',
  },
]

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  // Base classes for the sidebar
  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
    {
      "translate-x-0": isOpen,
      "-translate-x-full": !isOpen,
    }
  )

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <Card className={cn(sidebarClasses, "w-64")}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Icons.logo className="h-6 w-6 mr-2" />
            <span className="font-bold text-xl">KYC Service</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Icons.close className="h-5 w-5" />
            <span className="sr-only">Cerrar menú</span>
          </Button>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = Icons[item.icon as keyof typeof Icons]
              return (
                <li key={item.href}>
                  <Link
                    href={item.href as any}
                    className={cn(
                      'flex items-center px-4 py-2 rounded-md transition-colors',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                    onClick={() => {
                      // Close sidebar on mobile when a link is clicked
                      if (window.innerWidth < 1024) {
                        toggleSidebar()
                      }
                    }}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        <div className="mt-auto">
          {/* User profile section */}
          {session?.user && (
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
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
          
          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleSignOut}
            >
              <Icons.logout className="h-5 w-5 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </Card>
    </>
  )
} 