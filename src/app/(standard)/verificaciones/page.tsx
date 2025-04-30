'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/types/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/types/components/ui/table'
import { Badge } from '@/types/components/ui/badge'
import { UserIcon, FileTextIcon, BuildingIcon, ClockIcon, AlertTriangleIcon, ChevronDownIcon, ChevronUpIcon, Loader2Icon, FilterIcon } from 'lucide-react'
import { 
  GET_KYC_VERIFICATIONS, 
  KycVerification, 
  Document as KycDocument
} from '@/app/lib/graphql/kyc-queries'

// Cantidad de elementos a mostrar por página
const PAGE_SIZE = 5

// Tipos de verificación disponibles
const VERIFICATION_TYPES = ['all', 'gold', 'silver', 'bronze']

export default function VerificationsPage() {
  const { data, loading, error } = useQuery(GET_KYC_VERIFICATIONS)
  const [selectedVerification, setSelectedVerification] = useState<KycVerification | null>(null)
  const [displayedItems, setDisplayedItems] = useState<number>(PAGE_SIZE)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Manejar el progreso del scroll para la barra de progreso
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      const clientHeight = document.documentElement.clientHeight || window.innerHeight
      
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100
      setScrollProgress(scrollPercentage)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true)
    
    // Simular una carga
    setTimeout(() => {
      setDisplayedItems(prev => {
        const allVerifications = data?.kycVerificationsWithRelations || []
        return Math.min(prev + PAGE_SIZE, filteredVerifications.length)
      })
      setIsLoadingMore(false)
    }, 600)
  }, [data])

  // Resetear la paginación cuando cambian los datos o el filtro
  useEffect(() => {
    if (data) {
      setDisplayedItems(PAGE_SIZE)
    }
  }, [data, activeFilter, searchTerm])

  if (loading && !isLoadingMore) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2Icon className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando verificaciones...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangleIcon className="h-10 w-10 text-destructive" />
          <p className="text-destructive">Error al cargar las verificaciones</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  const allVerifications: KycVerification[] = data?.kycVerificationsWithRelations || []
  
  // Filtrar verificaciones basadas en el tipo seleccionado y término de búsqueda
  const filteredVerifications = allVerifications
    .filter(verification => {
      // Filtrar por tipo de verificación
      const typeMatch = activeFilter === 'all' || verification.verificationType.toLowerCase() === activeFilter
      
      // Filtrar por término de búsqueda
      const searchMatch = searchTerm === '' || 
        verification.kycPersons.some(person => 
          `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        verification.company?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.verificationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.status.toLowerCase().includes(searchTerm.toLowerCase())
      
      return typeMatch && searchMatch
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  
  const verifications = filteredVerifications.slice(0, displayedItems)
  const hasMore = displayedItems < filteredVerifications.length
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'verification_completed':
      case 'facetec_completed':
        return <Badge variant="success">{status}</Badge>
      case 'pending':
        return <Badge variant="warning">{status}</Badge>
      case 'rejected':
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  
  const getVerificationTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gold':
        return <Badge variant="gold">{type}</Badge>
      case 'silver':
        return <Badge variant="silver">{type}</Badge>
      case 'bronze':
        return <Badge variant="bronze">{type}</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const handleRowClick = (verification: KycVerification) => {
    setSelectedVerification(verification === selectedVerification ? null : verification)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  const countFileTypes = (docs: KycDocument[]) => {
    const types = {
      ID_FRONT: 0,
      ID_BACK: 0,
      SELFIE: 0,
      OTHER: 0
    }
    
    docs.forEach(doc => {
      if (doc.fileName.includes('ID_FRONT')) types.ID_FRONT++
      else if (doc.fileName.includes('ID_BACK')) types.ID_BACK++
      else if (doc.fileName.includes('SELFIE')) types.SELFIE++
      else types.OTHER++
    })
    
    return types
  }

  return (
    <div className="space-y-6">
      {/* Barra de progreso */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Verificaciones</h1>
        <Badge variant="outline" className="px-3 py-1">
          <span className="font-mono mr-1">{filteredVerifications.length}</span> 
          <span className="text-muted-foreground">resultados</span>
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total</CardTitle>
            <CardDescription>Verificaciones totales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileTextIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <p className="text-2xl font-bold">{allVerifications.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pendientes</CardTitle>
            <CardDescription>Requieren revisión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4 text-yellow-500" />
              <p className="text-2xl font-bold">
                {allVerifications.filter(v => v.status.toLowerCase() === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Empresas</CardTitle>
            <CardDescription>Empresas distintas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BuildingIcon className="mr-2 h-4 w-4 text-blue-500" />
              <p className="text-2xl font-bold">
                {new Set(allVerifications.map(v => v.company?.companyName)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card relative overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg font-semibold">Listado de Verificaciones</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Filtro por tipo */}
              <div className="flex gap-1 flex-wrap">
                {VERIFICATION_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeFilter === type 
                        ? (
                          type === 'all' 
                            ? 'bg-primary text-primary-foreground' 
                            : type === 'gold' 
                              ? 'bg-amber-400 text-amber-950' 
                              : type === 'silver' 
                                ? 'bg-gray-300 text-gray-800' 
                                : 'bg-amber-700 text-white'
                        ) 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {type === 'all' ? 'Todos' : type}
                  </button>
                ))}
              </div>
              
              {/* Búsqueda */}
              <div className="relative w-full sm:w-auto">
                <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar verificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 rounded-md border border-input bg-background px-9 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <span className="sr-only">Limpiar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead>Última actividad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {searchTerm || activeFilter !== 'all' 
                        ? 'No hay verificaciones que coincidan con los filtros' 
                        : 'No hay verificaciones disponibles'}
                    </TableCell>
                  </TableRow>
                ) : (
                  verifications.map((verification, index) => {
                    const person = verification.kycPersons?.[0] || {}
                    const lastActivity = verification.verificationLinks?.[0]?.lastAccessedAt
                    const docCounts = countFileTypes(verification.documents || [])
                    
                    return (
                      <React.Fragment key={index}>
                        <TableRow 
                          onClick={() => handleRowClick(verification)}
                          className={`cursor-pointer transition-colors ${selectedVerification === verification ? 'bg-muted' : 'hover:bg-muted/40'}`}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-grow">
                                <div className="flex items-center gap-1">
                                  <p className="font-medium">{person.firstName} {person.lastName}</p>
                                  
                                  {verification.externalVerifications && verification.externalVerifications.length > 0 && (
                                    <>
                                      {verification.externalVerifications.some(ext => ext.status === 'completed') ? (
                                        <div className="inline-flex" title="Identidad verificada">
                                          <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            className="h-4 w-4 text-blue-500"
                                          >
                                            <path 
                                              fill="currentColor" 
                                              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.7 14.5l-3.2-3.2 1.4-1.4 1.8 1.8 4.8-4.8 1.4 1.4-6.2 6.2z"
                                            />
                                          </svg>
                                        </div>
                                      ) : (
                                        <div className="inline-flex animate-pulse" title="Verificación en proceso">
                                          <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            className="h-4 w-4 text-amber-500"
                                          >
                                            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
                                            <path 
                                              stroke="currentColor" 
                                              strokeWidth="2"
                                              d="M12 7v5l3 3"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  <span>{person.email || 'No email'}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{verification.company?.companyName || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getVerificationTypeBadge(verification.verificationType)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(verification.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1.5 flex-wrap">
                              {docCounts.ID_FRONT > 0 && (
                                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                  <span>ID Front</span>
                                </Badge>
                              )}
                              {docCounts.ID_BACK > 0 && (
                                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10M7 12h10M7 17h10" /></svg>
                                  <span>ID Back</span>
                                </Badge>
                              )}
                              {docCounts.SELFIE > 0 && (
                                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
                                  <span>Selfie</span>
                                </Badge>
                              )}
                              {docCounts.OTHER > 0 && (
                                <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
                                  <FileTextIcon className="h-3 w-3" />
                                  <span>Otros</span>
                                  <span className="text-xs bg-background px-1 rounded-full">{docCounts.OTHER}</span>
                                </Badge>
                              )}
                              {(docCounts.ID_FRONT + docCounts.ID_BACK + docCounts.SELFIE + docCounts.OTHER) === 0 && (
                                <span className="text-xs text-muted-foreground">Sin documentos</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {verification.updatedAt ? (
                              <span className="text-sm">{formatDate(verification.updatedAt)}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">No actividad</span>
                            )}
                          </TableCell>
                        </TableRow>
                        
                        {selectedVerification === verification && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-muted/30 px-4 py-4 animate-in fade-in duration-200">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium">Detalles de verificación</h3>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedVerification(null)
                                  }} 
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <ChevronUpIcon className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h3 className="font-medium mb-2 text-sm text-muted-foreground">Información personal</h3>
                                  <div className="space-y-2 rounded-lg border p-3 bg-background/50">
                                    <div className="flex justify-between text-sm border-b pb-1">
                                      <span className="text-muted-foreground">Nombre completo:</span>
                                      <span>{person.firstName} {person.lastName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b pb-1">
                                      <span className="text-muted-foreground">Email:</span>
                                      <span>{person.email || 'No disponible'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b pb-1">
                                      <span className="text-muted-foreground">Teléfono:</span>
                                      <span>{person.phone || 'No disponible'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b pb-1">
                                      <span className="text-muted-foreground">Tipo:</span>
                                      <span>{getVerificationTypeBadge(verification.verificationType)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b pb-1">
                                      <span className="text-muted-foreground">Estado:</span>
                                      <span>{getStatusBadge(verification.status)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-muted-foreground">Notas:</span>
                                      <span>{verification.notes || 'Sin notas'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="font-medium mb-2 text-sm text-muted-foreground">Documentos ({verification.documents.length})</h3>
                                  <div className="rounded-lg border p-3 bg-background/50">
                                    {verification.documents.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mb-3">
                                        {docCounts.ID_FRONT > 0 && (
                                          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                            <span>ID Front</span>
                                            <span className="text-xs bg-blue-100 px-1.5 rounded-full">{docCounts.ID_FRONT}</span>
                                          </Badge>
                                        )}
                                        {docCounts.ID_BACK > 0 && (
                                          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 border-purple-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10M7 12h10M7 17h10" /></svg>
                                            <span>ID Back</span>
                                            <span className="text-xs bg-purple-100 px-1.5 rounded-full">{docCounts.ID_BACK}</span>
                                          </Badge>
                                        )}
                                        {docCounts.SELFIE > 0 && (
                                          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 border-green-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
                                            <span>Selfie</span>
                                            <span className="text-xs bg-green-100 px-1.5 rounded-full">{docCounts.SELFIE}</span>
                                          </Badge>
                                        )}
                                        {docCounts.OTHER > 0 && (
                                          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
                                            <FileTextIcon className="h-3 w-3" />
                                            <span>Otros</span>
                                            <span className="text-xs bg-background px-1.5 rounded-full">{docCounts.OTHER}</span>
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                    <div className="text-sm space-y-1 max-h-[200px] overflow-y-auto">
                                      {verification.documents.length > 0 ? (
                                        verification.documents.map((doc, idx) => {
                                          let iconElement;
                                          let bgClass = "hover:bg-muted";
                                          
                                          if (doc.fileName.includes('ID_FRONT')) {
                                            iconElement = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-2 text-blue-500"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>;
                                            bgClass = "hover:bg-blue-50";
                                          } else if (doc.fileName.includes('ID_BACK')) {
                                            iconElement = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-2 text-purple-500"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10M7 12h10M7 17h10" /></svg>;
                                            bgClass = "hover:bg-purple-50";
                                          } else if (doc.fileName.includes('SELFIE')) {
                                            iconElement = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-2 text-green-500"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>;
                                            bgClass = "hover:bg-green-50";
                                          } else {
                                            iconElement = <FileTextIcon className="h-3 w-3 mr-2 text-muted-foreground" />;
                                          }
                                          
                                          return (
                                            <div key={idx} className={`flex items-center p-1 rounded group ${bgClass}`}>
                                              {iconElement}
                                              <span className="text-xs truncate">{doc.fileName}</span>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <p className="text-muted-foreground">No hay documentos</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Verificaciones externas */}
                                  {verification.externalVerifications && verification.externalVerifications.length > 0 && (
                                    <div className="mt-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-medium text-sm text-muted-foreground">Verificaciones de identidad</h3>
                                      </div>
                                      <div className="rounded-lg border p-3 bg-background/50 space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                          {verification.externalVerifications.map((ext, idx) => {
                                            // Determinar color y estado visual según proveedor y estado
                                            let color, icon, bgClass;
                                            
                                            // Asignar colores según proveedor
                                            switch(ext.provider.toUpperCase()) {
                                              case 'RENAPO':
                                                color = ext.status === 'completed' ? 'text-emerald-700' : 'text-amber-700';
                                                bgClass = ext.status === 'completed' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200';
                                                icon = (
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                    <path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/>
                                                    <rect width="20" height="12" x="2" y="9" rx="2"/>
                                                    <path d="M12 12h.01"/>
                                                  </svg>
                                                );
                                                break;
                                              case 'INE':
                                                color = ext.status === 'completed' ? 'text-blue-700' : 'text-blue-400';
                                                bgClass = ext.status === 'completed' ? 'bg-blue-50 border-blue-200' : 'bg-blue-50/50 border-blue-100';
                                                icon = (
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                    <path d="M16 12h.01"/>
                                                    <path d="M8 12h.01"/>
                                                    <path d="M12 16h.01"/>
                                                    <path d="M12 8h.01"/>
                                                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                                                  </svg>
                                                );
                                                break;
                                              default:
                                                color = ext.status === 'completed' ? 'text-indigo-700' : 'text-indigo-400';
                                                bgClass = ext.status === 'completed' ? 'bg-indigo-50 border-indigo-200' : 'bg-indigo-50/50 border-indigo-100';
                                                icon = (
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                                  </svg>
                                                );
                                            }
                                            
                                            return (
                                              <div key={idx} className={`flex flex-col rounded-lg border p-2 ${bgClass}`}>
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-1.5">
                                                    <div className={`${color}`}>
                                                      {icon}
                                                    </div>
                                                    <span className={`text-xs font-medium uppercase ${color}`}>
                                                      {ext.provider}
                                                    </span>
                                                  </div>
                                                  
                                                  {ext.status === 'completed' ? (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 rounded-full">
                                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-emerald-700">
                                                        <path d="M20 6 9 17l-5-5"/>
                                                      </svg>
                                                      <span className="text-[10px] font-medium text-emerald-700">Verificado</span>
                                                    </div>
                                                  ) : (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 rounded-full">
                                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-amber-700">
                                                        <path d="M12 9v4"/>
                                                        <path d="M12 16h.01"/>
                                                        <circle cx="12" cy="12" r="10"/>
                                                      </svg>
                                                      <span className="text-[10px] font-medium text-amber-700">Pendiente</span>
                                                    </div>
                                                  )}
                                                </div>
                                                
                                                {ext.status === 'completed' && (
                                                  <div className="mt-2 flex justify-center">
                                                    <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-100/50 text-[10px] text-emerald-700">
                                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1">
                                                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                                                        <path d="m9 12 2 2 4-4"/>
                                                      </svg>
                                                      Datos validados correctamente
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                        
                                        <div className="text-xs text-muted-foreground mt-2">
                                          <p>Las verificaciones externas validan la identidad con fuentes oficiales.</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    )
                  })
                )}
              </TableBody>
            </Table>

            {hasMore && (
              <div className="flex justify-center my-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="group relative overflow-hidden rounded-full border px-4 py-2 font-medium transition-all hover:border-primary disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoadingMore ? (
                      <>
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        <span>Cargando...</span>
                      </>
                    ) : (
                      <>
                        <ChevronDownIcon className="h-4 w-4 group-hover:animate-bounce" />
                        <span>Mostrar más</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          ({displayedItems}/{filteredVerifications.length})
                        </span>
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 transition-opacity group-hover:animate-shimmer group-hover:opacity-100"></span>
                </button>
              </div>
            )}
            
            {displayedItems > PAGE_SIZE && filteredVerifications.length > PAGE_SIZE && (
              <div className="flex justify-center items-center my-4 text-xs text-muted-foreground gap-1">
                <span>Mostrando</span>
                <span className="font-mono font-medium text-foreground">{Math.min(displayedItems, filteredVerifications.length)}</span>
                <span>de</span>
                <span className="font-mono font-medium text-foreground">{filteredVerifications.length}</span>
                <span>verificaciones</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 