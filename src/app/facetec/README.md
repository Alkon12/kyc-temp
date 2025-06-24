# Sistema de Documentos FaceTec Refactorizado

## 📋 Resumen

Se ha refactorizado completamente el sistema de guardado de documentos de FaceTec para mayor eficiencia, mantenibilidad y consistencia.

## 🏗️ Arquitectura Nueva

### Componentes Principales

#### 1. `FaceTecDocumentManager`
Servicio centralizado que maneja todo el flujo de guardado de documentos:
- ✅ Gestión unificada de selfies e imágenes de ID
- ✅ Aplicación automática de sellado de tiempo
- ✅ Fallbacks robustos en caso de error
- ✅ Estado centralizado de documentos guardados

#### 2. `useFaceTecDocuments` Hook
Hook de React que integra el manager con los componentes:
- ✅ Estado reactivo de documentos
- ✅ Funciones simplificadas para guardar
- ✅ Verificación de completitud

#### 3. Procesadores Actualizados
Los procesadores existentes ahora usan el nuevo sistema:
- ✅ `LivenessCheckProcessor` - Selfies optimizadas
- ✅ `PhotoIDMatchProcessor` - ID + Selfies optimizadas

## 🔧 Flujo Actualizado

### Antes (Sistema Antiguo)
```
FaceTec Processor → API Manual → DB + Paperless
                 ↓ (lógica compleja)
           Código duplicado + manejo de errores inconsistente
```

### Después (Sistema Nuevo)
```
FaceTec Processor → FaceTecDocumentManager → API Centralizada → DB + Paperless
                                         ↓ (lógica unificada)
                               Estado consistente + fallbacks robustos
```

## 📝 Uso del Nuevo Sistema

### En Componentes React

```typescript
import { useFaceTecDocuments } from './hooks/useFaceTecDocuments';

const MyComponent = () => {
  const { 
    saveSelfie, 
    saveIdImages, 
    documentStatus,
    isDocumentSaved 
  } = useFaceTecDocuments({
    verificationToken: token,
    isHighLevelVerification: verificationType === 'GOLD' || verificationType === 'SILVER'
  });

  // Guardar selfie
  const handleSelfieCapture = async (selfieImage, sessionResult) => {
    const success = await saveSelfie(selfieImage, sessionResult);
    if (success) {
      console.log('Selfie guardada correctamente');
    }
  };

  // Guardar imágenes de ID
  const handleIdCapture = async (frontImage, backImage, idScanResult) => {
    const success = await saveIdImages(frontImage, backImage, idScanResult);
    if (success) {
      console.log('ID guardado correctamente');
    }
  };

  // Verificar estado
  console.log('Estado de documentos:', documentStatus);
  console.log('¿Selfie guardada?:', isDocumentSaved('SELFIE'));
};
```

### En Procesadores (Uso Directo)

```typescript
import { FaceTecDocumentManager } from '../services/FaceTecDocumentManager';

class CustomProcessor {
  private documentManager: FaceTecDocumentManager;

  constructor(verificationToken: string) {
    this.documentManager = new FaceTecDocumentManager(verificationToken);
  }

  async processSelfie(selfieImage: string, sessionResult: any) {
    const result = await this.documentManager.saveSelfie(
      selfieImage,
      sessionResult,
      {
        applyTimestamp: true, // Para verificaciones premium
        additionalMetadata: {
          processor: 'CustomProcessor',
          customField: 'value'
        }
      }
    );
    
    if (result) {
      console.log('Documento guardado:', result);
    }
  }
}
```

## 🔍 Características Mejoradas

### Sellado de Tiempo Automático
```typescript
// Se aplica automáticamente para verificaciones Silver/Gold
const result = await documentManager.saveSelfie(image, session, {
  applyTimestamp: isHighLevelVerification
});
```

### Estado Centralizado
```typescript
const summary = documentManager.getDocumentsSummary();
const allSaved = documentManager.areAllDocumentsSaved(['SELFIE', 'ID_FRONT']);
```

### Fallbacks Robustos
- ✅ Si falla el nuevo sistema → fallback al sistema anterior
- ✅ Si falla Paperless → guardado local automático
- ✅ Reintentos automáticos en errores temporales

## 🚀 Beneficios

1. **Código más limpio**: Menos duplicación y lógica más clara
2. **Mejor testing**: Servicios independientes fáciles de testear
3. **Mantenimiento**: Cambios centralizados en un solo lugar
4. **Consistencia**: Mismo comportamiento en todos los procesadores
5. **Estado observable**: React hooks para UI reactiva
6. **Robustez**: Múltiples niveles de fallback

## 🔄 Migración Gradual

El sistema mantiene compatibilidad con el código anterior:
- Los procesadores existentes siguen funcionando
- Fallbacks automáticos al sistema anterior
- Migración progresiva sin interrupciones

## 🧪 Testing

```typescript
// Testing del manager
const manager = new FaceTecDocumentManager('test-token');
const result = await manager.saveSelfie(testImage, testSession);
expect(result).toBeTruthy();

// Testing del hook
const { result } = renderHook(() => useFaceTecDocuments({
  verificationToken: 'test-token'
}));
await act(async () => {
  await result.current.saveSelfie(testImage, testSession);
});
expect(result.current.documentStatus.selfie).toBe(true);
``` 