import { useSession } from 'next-auth/react';

interface Permission {
  id: string;
  permissionName: string;
}

export function usePermissions() {
  const { data: session } = useSession();
  
  const hasPermission = (permissionName: string): boolean => {
    if (!session?.user?.roles) return false;
    
    for (const role of session.user.roles) {
      if (role.permissions && Array.isArray(role.permissions)) {
        if (role.permissions.some((p: Permission) => p.permissionName === permissionName)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(permission => hasPermission(permission));
  };
  
  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionNames.every(permission => hasPermission(permission));
  };
  
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