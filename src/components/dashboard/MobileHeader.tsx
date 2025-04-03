'use client'

import React from 'react'
import { Button } from '@/types/components/ui/button'
import { Icons } from '@/components/icons'

interface MobileHeaderProps {
  toggleSidebar: () => void
}

export function MobileHeader({ toggleSidebar }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
      >
        <Icons.menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-lg font-medium">KYC Service</h1>
      </div>
    </header>
  )
} 