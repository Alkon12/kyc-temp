import { Prisma } from '@prisma/client'
export const DATA_PARAM_HEADER: Prisma.ParamHeaderCreateInput[] = [
    {
        id:'GUIA',
        description: 'Ruta guía de usuario'
    },
    {
        id: 'LEGAL', 
        description: 'Ruta legales'
    },
    {
        id: 'SCH_INI',
        description: 'Hora inicial citas'
    }, 
    {
        id: 'SCH_FIN', 
        description: 'Hora final citas'
    },
    {
        id: 'SCH_INTERV', 
        description: 'Intervalo de tiempo para citas'
    },
    {
        id: 'INVEN', 
        description: 'MOSTRAR INVENTARIO'
    }
]
