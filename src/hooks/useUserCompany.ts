import { useSession } from 'next-auth/react'

export function useUserCompany() {
  const { data: session } = useSession()
  
  // Obtener el primer companyId del usuario (asumiendo que un usuario puede pertenecer a múltiples compañías)
  const getCompanyId = (): string | null => {
    if (!session?.user?.roles) return null
    
    // Buscar el primer rol que tenga companyId
    const roleWithCompany = session.user.roles.find(role => role.companyId)
    return roleWithCompany?.companyId || null
  }
  
  const getAllCompanyIds = (): string[] => {
    if (!session?.user?.roles) return []
    
    return session.user.roles
      .filter(role => role.companyId)
      .map(role => role.companyId as string)
  }
  
  const hasCompanyAccess = (companyId: string): boolean => {
    if (!session?.user?.roles) return false
    
    return session.user.roles.some(role => role.companyId === companyId)
  }
  
  return {
    companyId: getCompanyId(),
    allCompanyIds: getAllCompanyIds(),
    hasCompanyAccess,
    isAuthenticated: !!session?.user,
    user: session?.user
  }
} 