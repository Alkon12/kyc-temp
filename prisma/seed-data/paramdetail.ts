import { Prisma } from '@prisma/client'

export const DATA_PARAM_DETAIL: Prisma.ParamDetailUncheckedCreateInput[] = [
    {
        id: "1", 
        value: "C:\Sistemas DVA\Relacion con clientes\UBER\ArchivosTmp",
        idParam:"GUIA"
    }, 
    {
        id: "2", 
        value:"C:\Sistemas DVA\Relacion con clientes\UBER\ArchivosTmp", 
        idParam : "LEGAL"
    }, 
    {
        id: "3", 
        value:"09:00", 
        idParam : "SCH_INI"
    }, 
    {
        id: "4", 
        value:"18:00", 
        idParam : "SCH_FIN"
    }, 
    {
        id: "5", 
        value:"15", 
        idParam : "SCH_INTERV"
    }, 
    {
        id: "6", 
        value:"1", 
        idParam : "INVEN"
    }
]
