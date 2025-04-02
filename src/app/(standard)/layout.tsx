'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Button } from '@/types/components/ui/button'
import { Icons } from '@/components/icons'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center p-4 lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Icons.menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <h1 className="text-xl font-bold">KYC Service</h1>
        </div>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 