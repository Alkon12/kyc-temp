import { useSession } from 'next-auth/react';

interface Permission {
  id: string;
  permissionName: string;
}

export function usePermissions() {
  const { data: session } = useSession();
  
  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permissionName: string): boolean => {
    if (!session?.user?.roles) return false;
    
    // Verificar cada rol del usuario
    for (const role of session.user.roles) {
      // Si el rol tiene permisos directamente incluidos en la sesión
      if (role.permissions && Array.isArray(role.permissions)) {
        if (role.permissions.some((p: Permission) => p.permissionName === permissionName)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Verificar si el usuario tiene al menos uno de varios permisos
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(permission => hasPermission(permission));
  };
  
  // Verificar si el usuario tiene todos los permisos especificados
  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionNames.every(permission => hasPermission(permission));
  };
  
  // Verificar si el usuario tiene un rol específico
  const hasRole = (roleName: string): boolean => {
    if (!session?.user?.roles) return false;
    return session.user.roles.some(role => role.roleName === roleName);
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole
  };
} 