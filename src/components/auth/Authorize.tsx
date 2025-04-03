import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

type AuthorizeProps = {
  permissions?: string | string[];
  roles?: string | string[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function Authorize({
  permissions,
  roles,
  requireAll = false,
  children,
  fallback = null
}: AuthorizeProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } = usePermissions();
  
  // Si no hay restricciones, mostrar el contenido
  if (!permissions && !roles) {
    return <>{children}</>;
  }
  
  // Verificar permisos
  let hasRequiredPermissions = false;
  if (permissions) {
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissionArray)
      : hasAnyPermission(permissionArray);
  }
  
  // Verificar roles
  let hasRequiredRoles = false;
  if (roles) {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    hasRequiredRoles = roleArray.some(role => hasRole(role));
  }
  
  // Si se especificaron ambas condiciones, el usuario debe cumplir con ambas
  const isAuthorized = 
    (permissions && roles) ? (hasRequiredPermissions && hasRequiredRoles) :
    permissions ? hasRequiredPermissions :
    roles ? hasRequiredRoles : false;
  
  return isAuthorized ? <>{children}</> : <>{fallback}</>;
} 