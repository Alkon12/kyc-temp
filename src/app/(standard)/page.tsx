'use client'
import React from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/types/components/ui/card'
import { FileCheckIcon, UsersIcon, AlertTriangleIcon, Loader2Icon } from 'lucide-react'
import { GET_KYC_VERIFICATIONS } from '@/app/lib/graphql/kyc-queries'

export default function HomePage() {
  const { data, loading, error } = useQuery(GET_KYC_VERIFICATIONS)
  
  // Count pending verifications
  const pendingVerifications = data?.kycVerificationsWithRelations?.filter(
    (v: any) => v.status.toLowerCase() === 'pending'
  )?.length || 0
  
  // Total verifications
  const totalVerifications = data?.kycVerificationsWithRelations?.length || 0

  return (
    <div className="space-y-6">      
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Usuarios</CardTitle>
            <CardDescription>Total de usuarios registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <p className="text-2xl font-bold">0</p>
            </div>
          </CardContent>
        </Card>
        
        <Link href="/verificaciones" className="transition-transform hover:scale-[1.01] focus:scale-[1.01]">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Verificaciones</CardTitle>
              <CardDescription>Verificaciones pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="text-2xl font-bold">...</p>
                </div>
              ) : error ? (
                <div className="flex items-center">
                  <AlertTriangleIcon className="mr-2 h-4 w-4 text-destructive" />
                  <p className="text-2xl font-bold">Error</p>
                </div>
              ) : (
                <div className="flex items-center">
                  <FileCheckIcon className="mr-2 h-4 w-4 text-yellow-500" />
                  <p className="text-2xl font-bold">{pendingVerifications}</p>
                  <span className="ml-2 text-xs text-muted-foreground">de {totalVerifications}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
        
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Estadísticas</CardTitle>
            <CardDescription>Resumen de actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            <CardDescription>Últimas verificaciones realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2Icon className="mr-2 h-5 w-5 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Cargando actividad...</p>
              </div>
            ) : error ? (
              <p className="text-sm text-muted-foreground">Error al cargar la actividad reciente</p>
            ) : data?.kycVerificationsWithRelations?.length > 0 ? (
              <div className="space-y-4">
                {data.kycVerificationsWithRelations.slice(0, 3).map((verification: any, index: number) => (
                  <div key={index} className="flex items-start gap-2 border-b pb-3">
                    <FileCheckIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {verification.kycPersons[0]?.firstName} {verification.kycPersons[0]?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Verificación tipo: {verification.verificationType}, Estado: {verification.status}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link 
                    href="/verificaciones" 
                    className="text-xs text-primary hover:underline"
                  >
                    Ver todas las verificaciones
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Estado del Sistema</CardTitle>
            <CardDescription>Información del servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">API Status</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Conectada
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
