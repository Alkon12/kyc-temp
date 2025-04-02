'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/types/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">      
      <h1 className="text-3xl font-bold">Configuración</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
          <CardDescription>Gestiona la configuración de la aplicación</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Aquí se mostrarán las opciones de configuración cuando estén implementadas.</p>
        </CardContent>
      </Card>
    </div>
  )
} 