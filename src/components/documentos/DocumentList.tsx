'use client'

import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/types/components/ui/card'
import { Button } from '@/types/components/ui/button'
import { Badge } from '@/types/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/types/components/ui/table'
import { FileTextIcon, RefreshCwIcon, CalendarIcon, TagIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react'
import { GET_ACTIVE_DOCUSEAL_TEMPLATES_BY_COMPANY_ID, SYNC_DOCUSEAL_TEMPLATES } from '@/app/lib/graphql/document-queries'
import type { DocusealTemplate } from '@/app/lib/graphql/document-queries'
import { useUserCompany } from '@/hooks/useUserCompany'
import { toast } from 'sonner'

export function DocumentList() {
  const { companyId, isAuthenticated } = useUserCompany()
  
  const { data, loading, error, refetch } = useQuery(GET_ACTIVE_DOCUSEAL_TEMPLATES_BY_COMPANY_ID, {
    variables: { companyId },
    skip: !companyId,
  })
  
  const [syncDocuments, { loading: syncing }] = useMutation(SYNC_DOCUSEAL_TEMPLATES, {
    onCompleted: (data) => {
      toast.success(`Se sincronizaron ${data.syncDocusealTemplates.length} documentos`)
      refetch()
    },
    onError: (error) => {
      toast.error(`Error al sincronizar documentos: ${error.message}`)
    }
  })
  
  const handleSync = () => {
    if (!companyId) return
    syncDocuments({ variables: { companyId } })
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertCircleIcon className="mx-auto h-12 w-12 mb-4" />
            <p>Debes iniciar sesión para ver los documentos</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (!companyId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertCircleIcon className="mx-auto h-12 w-12 mb-4" />
            <p>No tienes acceso a ninguna compañía</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const documents: DocusealTemplate[] = data?.getActiveDocusealTemplatesByCompanyId || []
  
  return (
    <div className="space-y-6">
      {/* Header con botón de sincronización */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Documentos</h2>
          <p className="text-muted-foreground">
            Gestiona los templates de documentos de tu compañía
          </p>
        </div>
        <Button 
          onClick={handleSync} 
          disabled={syncing}
          className="flex items-center gap-2"
        >
          <RefreshCwIcon className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Sincronizando...' : 'Sincronizar'}
        </Button>
      </div>
      
      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Activos</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(doc => doc.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos de Documento</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(documents.map(doc => doc.documentType)).size}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Lista de documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Documentos</CardTitle>
          <CardDescription>
            Todos los templates de documentos disponibles en tu compañía
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCwIcon className="mx-auto h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Cargando documentos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircleIcon className="mx-auto h-8 w-8 text-destructive mb-4" />
              <p className="text-destructive">Error al cargar documentos: {error.message}</p>
              <Button 
                variant="outline" 
                onClick={() => refetch()} 
                className="mt-4"
              >
                Reintentar
              </Button>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No hay documentos disponibles</p>
              <p className="text-sm text-muted-foreground mb-4">
                Haz clic en "Sincronizar" para importar documentos desde Docuseal
              </p>
              <Button onClick={handleSync} disabled={syncing}>
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                Sincronizar Documentos
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Campos</TableHead>
                  <TableHead>Creado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{document.name}</div>
                        {document.description && (
                          <div className="text-sm text-muted-foreground">
                            {document.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {document.documentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={document.isActive ? "default" : "destructive"}
                      >
                        {document.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {document.fields?.length || 0} campos
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {formatDate(document.createdAt)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 