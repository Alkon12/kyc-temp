export const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: 'dashboard',
  },
  {
    name: 'Usuarios',
    href: '/users',
    icon: 'users',
  },
] as const;

export const permissionedNavigationItems = [
  {
    name: 'Configuración',
    href: '/settings',
    icon: 'settings',
    requiredPermissions: ['company:manage'],
  },
  {
    name: 'Compañías',
    href: '/companies',
    icon: 'building',
    requiredPermissions: ['company:create'],
  },
] as const; 