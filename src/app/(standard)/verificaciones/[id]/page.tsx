'use client'

import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useParams } from 'next/navigation'
import { 
  GET_KYC_VERIFICATION_BY_ID, 
  UPDATE_EXTERNAL_VERIFICATION_REQUEST, 
  UPDATE_EXTERNAL_VERIFICATION_RESPONSE,
  UPDATE_EXTERNAL_VERIFICATION_STATUS
} from '@/app/lib/graphql/kyc-queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/types/components/ui/card'
import { Badge } from '@/types/components/ui/badge'
import { Input } from '@/types/components/ui/input'
import { Button } from '@/types/components/ui/button'
import { Loader2Icon, AlertTriangleIcon, ArrowLeftIcon, UserIcon, BuildingIcon, FileTextIcon, ShieldIcon, LinkIcon, ClockIcon, SaveIcon, CheckCircle2Icon, XCircleIcon, AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface Document {
  fileName: string
}

interface ExternalVerification {
  id: string
  provider: string
  status: string
  requestData: string
  responseData: string
  updatedAt: string
}

interface VerificationLink {
  token: string
  lastAccessedAt: string
  status: string
}

interface KycPerson {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
}

interface Company {
  companyName: string
}

interface KycVerification {
  id: string
  kycPersons: KycPerson[]
  status: string
  company: Company | null
  documents: Document[]
  externalVerifications: ExternalVerification[]
  verificationLinks: VerificationLink[]
  notes: string | null
  verificationType: string
  updatedAt: string
}

interface ExternalVerificationData {
  [key: string]: any
}

const formatVerificationData = (data: string): ExternalVerificationData => {
  try {
    console.log('Original data:', data)
    
    // Si el dato ya es un objeto, lo retornamos directamente
    if (typeof data === 'object') {
      return data
    }

    // Removemos las comillas extras y caracteres de escape
    let cleanData = data
      .replace(/^"|"$/g, '') // Remover comillas al inicio y final
      .replace(/\\"/g, '"')  // Reemplazar \" por "
      .replace(/\\\\/g, '\\') // Reemplazar \\ por \
    
    console.log('Cleaned data:', cleanData)

    try {
      // Intentamos parsear el JSON
      const parsedData = JSON.parse(cleanData)
      console.log('Parsed data:', parsedData)
      return parsedData
    } catch (parseError) {
      console.error('First parse attempt failed:', parseError)
      
      // Si falla, intentamos limpiar más el string
      cleanData = cleanData
        .replace(/^\\|\\$/g, '') // Remover \ al inicio y final
        .replace(/^"|"$/g, '')   // Remover comillas al inicio y final
      
      console.log('Second attempt cleaned data:', cleanData)
      
      // Intentamos parsear de nuevo
      return JSON.parse(cleanData)
    }
  } catch (error) {
    console.error('Error parsing verification data:', error)
    console.error('Original data:', data)
    return {}
  }
}

const renderVerificationField = (label: string, value: any, key: string, isEditable: boolean, onChange?: (value: string) => void) => {
  if (value === null || value === undefined) return null
  if (typeof value === 'object') return null

  return (
    <div key={key} className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {isEditable ? (
        <Input
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-8"
        />
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  )
}

const renderVerificationObject = (
  data: ExternalVerificationData, 
  prefix = '', 
  isRequest = false,
  isEditable = false,
  onChange?: (key: string, value: string) => void
): React.ReactElement[] => {
  return Object.entries(data)
    .filter(([key]) => !isRequest || key !== 'type')
    .map(([key, value]) => {
      const uniqueKey = `${prefix}${key}`
      
      if (value === null || value === undefined) return null
      if (typeof value === 'object') {
        return (
          <div key={uniqueKey} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{key}</p>
            <div className="pl-4 space-y-2">
              {renderVerificationObject(value, `${uniqueKey}.`, isRequest, isEditable, onChange)}
            </div>
          </div>
        )
      }
      return renderVerificationField(
        key, 
        value, 
        uniqueKey, 
        isEditable,
        (newValue) => onChange?.(uniqueKey, newValue)
      )
    }).filter(Boolean) as React.ReactElement[]
}

export default function VerificationDetailPage() {
  const [editedData, setEditedData] = useState<Record<string, string>>({})
  const [currentEditingVerification, setCurrentEditingVerification] = useState<string | null>(null)
  const [revalidating, setRevalidating] = useState(false)
  const params = useParams<{ id: string }>()
  const verificationId = params?.id

  // Configure the mutation to update request data
  const [updateExternalVerification, { loading: isUpdating }] = useMutation(UPDATE_EXTERNAL_VERIFICATION_REQUEST, {
    onCompleted: () => {
      toast.success("Datos actualizados correctamente")
      
      // Si estamos editando una verificación, procedemos a revalidarla
      if (currentEditingVerification) {
        // Obtener la verificación actual de los datos cargados
        const verification = data?.kycVerificationWithRelationsById.externalVerifications.find(
          (ev: any) => ev.id === currentEditingVerification
        );
        
        if (verification) {
          // Iniciar la revalidación con los datos actualizados (los que acabamos de editar)
          handleRevalidate(verification, editedData);
        } else {
          toast.error("No se pudo encontrar la verificación para revalidar");
          setRevalidating(false);
        }
      }
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`)
      setRevalidating(false)
    }
  })

  // Mutation to update response data
  const [updateExternalVerificationResponse] = useMutation(UPDATE_EXTERNAL_VERIFICATION_RESPONSE);

  // Mutation to update status
  const [updateExternalVerificationStatus] = useMutation(UPDATE_EXTERNAL_VERIFICATION_STATUS, {
    onCompleted: () => {
      toast.success("Verificación procesada correctamente")
      
      // Reset states after all operations complete
      setEditedData({})
      setCurrentEditingVerification(null)
      setRevalidating(false)
      
      // Refetch to update the UI
      refetch()
    },
    onError: (error) => {
      toast.error(`Error al actualizar el estado: ${error.message}`)
      setRevalidating(false)
    },
    refetchQueries: [
      {
        query: GET_KYC_VERIFICATION_BY_ID,
        variables: { id: verificationId }
      }
    ]
  });

  // Function to handle revalidation with the updated data
  const handleRevalidate = async (verification: any, newData: Record<string, string>) => {
    try {
      setRevalidating(true);
      
      // Obtener los datos originales de la solicitud
      const originalRequestData = formatVerificationData(verification.requestData);
      
      // Crear un nuevo objeto de solicitud con los cambios aplicados
      const updatedRequestData = { ...originalRequestData };
      
      // Aplicar los cambios del formulario
      Object.entries(newData).forEach(([key, value]) => {
        // Manejar propiedades anidadas (con puntos)
        if (key.includes('.')) {
          const parts = key.split('.');
          let currentObj = updatedRequestData;
          
          // Navegar al objeto anidado
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!currentObj[part]) {
              currentObj[part] = {};
            }
            currentObj = currentObj[part];
          }
          
          // Establecer el valor en el último nivel
          currentObj[parts[parts.length - 1]] = value;
        } else {
          // Manejar propiedades de nivel superior
          updatedRequestData[key] = value;
        }
      });
      
      // Verificar si hay token en los datos
      if (!updatedRequestData.token) {
        // Buscar un token en los enlaces de verificación
        const verificacionLinks = data?.kycVerificationWithRelationsById?.verificationLinks || [];
        console.log("Enlaces de verificación disponibles:", verificacionLinks);
        
        // Buscar enlaces activos primero
        let enlaceActivo = verificacionLinks.find((link: VerificationLink) => link.status === 'active');
        
        // Si no hay enlaces activos, intentar con cualquier enlace
        if (!enlaceActivo && verificacionLinks.length > 0) {
          enlaceActivo = verificacionLinks[0];
          console.log("No se encontró enlace activo, usando el primer enlace disponible");
        }
        
        if (enlaceActivo) {
          console.log("Enlace de verificación encontrado:", enlaceActivo);
          
          if (enlaceActivo.token) {
            updatedRequestData.token = enlaceActivo.token;
            console.log("Token añadido automáticamente:", enlaceActivo.token);
          } else {
            console.error("El enlace no tiene token:", enlaceActivo);
            toast.error("El enlace de verificación no tiene token");
          }
        } else {
          console.error("No se encontró ningún enlace de verificación");
          toast.error("No se encontraron enlaces de verificación");
        }
      }
      
      // Verificar nuevamente si tenemos todos los datos necesarios
      if (!updatedRequestData.token) {
        console.error("No se pudo obtener un token de verificación válido");
        toast.error("No se pudo obtener un token de verificación válido. La revalidación no puede continuar.");
        setRevalidating(false);
        return;
      }
      
      // Determinar qué servicio llamar según el proveedor
      const provider = verification.provider;
      
      if (provider === "RENAPO") {
        // Validación CURP
        await revalidateCurp(verification.id, updatedRequestData);
      } else if (provider === "INE") {
        // Validación Lista Nominal
        await revalidateListaNominal(verification.id, updatedRequestData);
      } else {
        toast.error(`Proveedor desconocido: ${provider}`);
        setRevalidating(false);
      }
    } catch (error) {
      console.error("Error durante la revalidación:", error);
      toast.error("Error al revalidar los datos");
      setRevalidating(false);
    }
  };

  // Revalidate CURP with the updated data
  const revalidateCurp = async (id: string, requestData: any) => {
    try {
      // Mostrar datos completos para depuración
      console.log("Datos de solicitud completos para CURP:", requestData);
      
      // Extraer los datos requeridos y verificar cada uno
      const { curp, token } = requestData;
      console.log("CURP a validar:", curp);
      console.log("Token a utilizar:", token);
      
      // Si no hay CURP, no podemos continuar
      if (!curp) {
        toast.error("Falta CURP para la validación. Por favor, asegúrate de incluir este dato.");
        setRevalidating(false);
        return;
      }
      
      // Si no hay token, no podemos continuar
      if (!token) {
        toast.error("Falta token de verificación. Por favor, intenta nuevamente.");
        setRevalidating(false);
        return;
      }
      
      console.log("Enviando solicitud de validación CURP con datos:", { curp, token });
      toast.info("Enviando solicitud de validación CURP...");
      
      // Make the API call
      const response = await fetch('/api/v1/curp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ curp, token }),
      });
      
      // Obtener el texto de la respuesta para análisis
      const responseText = await response.text();
      console.log(`Respuesta raw del API (${response.status}):`, responseText);
      
      // Intentar parsear la respuesta como JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error al parsear la respuesta JSON:", parseError);
        toast.error("Error: La respuesta del servidor no es un JSON válido");
        setRevalidating(false);
        return;
      }
      
      // Verificar el status de la respuesta
      if (!response.ok) {
        console.error(`Error en la respuesta del API (${response.status}):`, result);
        toast.error(`Error del servidor: ${response.status} - ${result.message || 'Error desconocido'}`);
        setRevalidating(false);
        return;
      }
      
      console.log("Respuesta del API de CURP:", result);
      
      // Update the response data
      toast.info("Actualizando datos de respuesta...");
      await updateExternalVerificationResponse({
        variables: {
          updateExternalVerificationResponseId: id,
          responseData: JSON.stringify({
            ...result,
            validationType: "CURP",
            savedAt: new Date().toISOString()
          })
        }
      });
      
      // Update the status based on the result
      const newStatus = result.success ? "completed" : "failed";
      toast.info(`Actualizando estado a: ${newStatus}...`);
      await updateExternalVerificationStatus({
        variables: {
          updateExternalVerificationStatusId: id,
          status: newStatus
        }
      });
      
      // Mostrar un resumen del resultado
      if (result.success) {
        toast.success("CURP validada correctamente");
      } else {
        toast.error(`Error al validar CURP: ${result.message || 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.error("Error revalidando CURP:", error);
      toast.error("Error al revalidar CURP: " + (error instanceof Error ? error.message : "Error desconocido"));
      setRevalidating(false);
    }
  };

  // Revalidate Lista Nominal with the updated data
  const revalidateListaNominal = async (id: string, requestData: any) => {
    try {
      // Mostrar datos completos para depuración
      console.log("Datos de solicitud completos para Lista Nominal:", requestData);
      
      // Extract the required data
      const { cic, identificador, token } = requestData;
      console.log("CIC a validar:", cic);
      console.log("Identificador a validar:", identificador);
      console.log("Token a utilizar:", token);
      
      // Verificar si faltan datos críticos
      const datosFaltantes = [];
      if (!cic) datosFaltantes.push("CIC");
      if (!identificador) datosFaltantes.push("Identificador");
      if (!token) datosFaltantes.push("Token de verificación");
      
      if (datosFaltantes.length > 0) {
        toast.error(`Faltan datos requeridos: ${datosFaltantes.join(", ")}`);
        setRevalidating(false);
        return;
      }
      
      console.log("Enviando solicitud de validación Lista Nominal con datos:", { cic, identificador, token });
      toast.info("Enviando solicitud de validación Lista Nominal...");
      
      // Make the API call
      const response = await fetch('/api/v1/lista-nominal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cic, identificador, token }),
      });
      
      // Obtener el texto de la respuesta para análisis
      const responseText = await response.text();
      console.log(`Respuesta raw del API (${response.status}):`, responseText);
      
      // Intentar parsear la respuesta como JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error al parsear la respuesta JSON:", parseError);
        toast.error("Error: La respuesta del servidor no es un JSON válido");
        setRevalidating(false);
        return;
      }
      
      // Verificar el status de la respuesta
      if (!response.ok) {
        console.error(`Error en la respuesta del API (${response.status}):`, result);
        toast.error(`Error del servidor: ${response.status} - ${result.message || 'Error desconocido'}`);
        setRevalidating(false);
        return;
      }
      
      console.log("Respuesta del API de Lista Nominal:", result);
      
      // Update the response data
      toast.info("Actualizando datos de respuesta...");
      await updateExternalVerificationResponse({
        variables: {
          updateExternalVerificationResponseId: id,
          responseData: JSON.stringify({
            ...result,
            validationType: "LISTA_NOMINAL",
            savedAt: new Date().toISOString()
          })
        }
      });
      
      // For Lista Nominal, estado=3 means valid even if success is false
      let isSuccess = result.success;
      if (!isSuccess && result.data?.data?.estado === 3) {
        isSuccess = true;
        console.log("Estado=3 detectado, considerando como éxito aunque success=false");
      }
      
      // Update the status based on the result
      const newStatus = isSuccess ? "completed" : "failed";
      toast.info(`Actualizando estado a: ${newStatus}...`);
      await updateExternalVerificationStatus({
        variables: {
          updateExternalVerificationStatusId: id,
          status: newStatus
        }
      });
      
      // Mostrar un resumen del resultado
      if (isSuccess) {
        toast.success("Lista Nominal validada correctamente");
      } else {
        toast.error(`Error al validar Lista Nominal: ${result.message || 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.error("Error revalidando Lista Nominal:", error);
      toast.error("Error al revalidar Lista Nominal: " + (error instanceof Error ? error.message : "Error desconocido"));
      setRevalidating(false);
    }
  };

  if (!verificationId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangleIcon className="h-10 w-10 text-destructive" />
          <p className="text-destructive">ID de verificación no válido</p>
        </div>
      </div>
    )
  }

  const { data, loading, error, refetch } = useQuery(GET_KYC_VERIFICATION_BY_ID, {
    variables: { id: verificationId },
    onCompleted: (queryData) => {
      console.log("Datos de verificación cargados:", queryData);
      
      // Revisar los enlaces de verificación
      const verificationLinks = queryData?.kycVerificationWithRelationsById?.verificationLinks || [];
      console.log("Enlaces de verificación encontrados:", verificationLinks);
      
      // Mostrar tokens disponibles
      const tokens = verificationLinks.map((link: any) => ({
        status: link.status,
        token: link.token,
        lastAccessedAt: link.lastAccessedAt
      }));
      console.log("Tokens disponibles:", tokens);
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2Icon className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando verificación...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangleIcon className="h-10 w-10 text-destructive" />
          <p className="text-destructive">Error al cargar la verificación</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  const verification = data?.kycVerificationWithRelationsById
  if (!verification) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangleIcon className="h-10 w-10 text-destructive" />
          <p className="text-destructive">Verificación no encontrada</p>
        </div>
      </div>
    )
  }

  const person = verification.kycPersons?.[0] || {}

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'verification_completed':
      case 'facetec_completed':
        return <Badge variant="success">{status}</Badge>
      case 'pending':
      case 'requires-review':
        return <Badge variant="warning">{status}</Badge>
      case 'rejected':
      case 'failed':
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Fecha inválida'
      }
      return format(date, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Fecha inválida'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <Link
          href="/verificaciones"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Volver a verificaciones</span>
        </Link>
        <div className="flex items-center gap-4">
          {getVerificationTypeBadge(verification.verificationType)}
          {getStatusBadge(verification.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nombre Completo</p>
                <p className="font-medium">{person.firstName} {person.lastName}</p>
              </div>
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{person.email || 'No disponible'}</p>
              </div>
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{person.phone || 'No disponible'}</p>
              </div>
          </CardContent>
        </Card>

        {/* Información de Empresa */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center gap-2">
            <BuildingIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nombre de la Empresa</p>
                <p className="font-medium">{verification.company?.companyName || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Estado de Verificación */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Estado de Verificación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Última actualización</p>
              <p className="font-medium">{formatDate(verification.updatedAt)}</p>
            </div>
            {verification.notes && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Notas</p>
                <p className="font-medium">{verification.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verification.documents.map((doc: Document, index: number) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium truncate">{doc.fileName}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enlaces de Verificación */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Enlaces de Verificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verification.verificationLinks.map((link: VerificationLink, index: number) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{formatDate(link.lastAccessedAt)}</p>
                    </div>
                    {getStatusBadge(link.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verificaciones Externas */}
        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Verificaciones Externas</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {verification.externalVerifications.length} verificaciones
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {verification.externalVerifications.map((verification: ExternalVerification, index: number) => {
                const requestData = formatVerificationData(verification.requestData)
                const responseData = formatVerificationData(verification.responseData)
                const isEditable = verification.status.toLowerCase() === 'failed'
                
                const handleDataChange = (key: string, value: string) => {
                  setEditedData(prev => ({
                    ...prev,
                    [key]: value
                  }))
                  // Set the current verification being edited
                  setCurrentEditingVerification(verification.id)
                }

                const handleSave = () => {
                  if (!verification.id || Object.keys(editedData).length === 0) {
                    return;
                  }
                  
                  try {
                    // Get the original request data
                    const originalRequestData = formatVerificationData(verification.requestData);
                    
                    // Create a new request data object with the edited values
                    const updatedRequestData = { ...originalRequestData };
                    
                    // Apply the changes from editedData
                    Object.entries(editedData).forEach(([key, value]) => {
                      // Handle nested properties (keys with dots)
                      if (key.includes('.')) {
                        const parts = key.split('.');
                        let currentObj = updatedRequestData;
                        
                        // Navigate to the nested object
                        for (let i = 0; i < parts.length - 1; i++) {
                          const part = parts[i];
                          if (!currentObj[part]) {
                            currentObj[part] = {};
                          }
                          currentObj = currentObj[part];
                        }
                        
                        // Set the value in the last level
                        currentObj[parts[parts.length - 1]] = value;
                      } else {
                        // Handle top-level properties
                        updatedRequestData[key] = value;
                      }
                    });
                    
                    // Make sure we preserve the type if it exists
                    if (originalRequestData.type && !updatedRequestData.type) {
                      updatedRequestData.type = originalRequestData.type;
                    }
                    
                    // Execute the update mutation - the revalidation will happen in onCompleted
                    setRevalidating(true);
                    updateExternalVerification({
                      variables: {
                        updateExternalVerificationRequestId: verification.id,
                        requestData: JSON.stringify(updatedRequestData)
                      }
                    });
                  } catch (error) {
                    console.error('Error updating verification:', error);
                    toast.error("Ha ocurrido un error al procesar los datos");
                    setRevalidating(false);
                  }
                };

                const getStatusColor = (status: string) => {
                  switch (status.toLowerCase()) {
                    case 'approved':
                    case 'completed':
                    case 'verification_completed':
                    case 'facetec_completed':
                      return 'bg-green-500/10 text-green-500 border-green-500/20'
                    case 'pending':
                    case 'requires-review':
                      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    case 'rejected':
                    case 'failed':
                      return 'bg-red-500/10 text-red-500 border-red-500/20'
                    default:
                      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                  }
                }
                
                return (
                  <div 
                    key={`verification-${index}`} 
                    className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                    
                    <div className="relative space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <ShieldIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{verification.provider}</h3>
                          </div>
                        </div>
                        <div className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(verification.status)}`}>
                          {verification.status}
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Request Data */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm font-medium">Datos Enviados</p>
                            </div>
                            {isEditable && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleSave}
                                className="h-8"
                                disabled={isUpdating || revalidating || Object.keys(editedData).length === 0 || verification.id !== currentEditingVerification}
                              >
                                {(isUpdating || revalidating) ? 
                                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : 
                                  <SaveIcon className="mr-2 h-4 w-4" />
                                }
                                {isUpdating ? "Guardando..." : 
                                 revalidating ? "Revalidando..." : 
                                 "Guardar y Revalidar"}
                              </Button>
                            )}
                          </div>
                          <div className="rounded-lg border bg-card p-4 space-y-4">
                            {renderVerificationObject(
                              requestData, 
                              '', 
                              true, 
                              isEditable,
                              handleDataChange
                            )}
                          </div>
                        </div>

                        {/* Response Data */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">Respuesta Recibida</p>
                          </div>
                          <div className="rounded-lg border bg-card p-4 space-y-4">
                            {responseData.success !== undefined && (
                              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                                responseData.success 
                                  ? 'bg-green-500/10 text-green-500' 
                                  : 'bg-red-500/10 text-red-500'
                              }`}>
                                {responseData.success ? (
                                  <CheckCircle2Icon className="h-5 w-5" />
                                ) : (
                                  <XCircleIcon className="h-5 w-5" />
                                )}
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">
                                    {responseData.success ? 'Verificación Exitosa' : 'Verificación Fallida'}
                                  </p>
                                  {responseData.message && (
                                    <p className="text-sm opacity-80">{responseData.message}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="grid gap-4">
                              {Object.entries(responseData).map(([key, value]) => {
                                if (key === 'success' || key === 'message') return null
                                if (value === null || value === undefined) return null

                                if (typeof value === 'object' && value !== null) {
                                  return (
                                    <div key={key} className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <AlertCircleIcon className="h-4 w-4 text-primary" />
                                        <p className="text-sm font-medium capitalize">{key}</p>
                                      </div>
                                      <div className="pl-6 space-y-3">
                                        {Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                                          <div key={subKey} className="flex items-start gap-3">
                                            <div className="w-24 shrink-0">
                                              <p className="text-xs text-muted-foreground capitalize">{subKey}</p>
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-sm">{String(subValue)}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                }

                                return (
                                  <div key={key} className="flex items-start gap-3">
                                    <div className="w-24 shrink-0">
                                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm">{String(value)}</p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>

                            {responseData.savedAt && (
                              <div className="pt-4 mt-4 border-t">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <ClockIcon className="h-3 w-3" />
                                  <span>Última actualización: {formatDate(responseData.savedAt)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 