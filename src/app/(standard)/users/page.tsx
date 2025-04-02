'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/types/components/ui/card'

export default function UsersPage() {
  return (
    <div className="space-y-6">      
      <h1 className="text-3xl font-bold">Usuarios</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Gestiona los usuarios del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Aquí se mostrará la lista de usuarios cuando esté implementada.</p>
        </CardContent>
      </Card>
    </div>
  )
} 