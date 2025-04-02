import { 
  LucideProps, 
  Loader2, 
  LogIn, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export const Icons = {
  logo: LogIn,
  spinner: Loader2,
  dashboard: LayoutDashboard,
  users: Users,
  settings: Settings,
  logout: LogOut,
  menu: Menu,
  close: X
};

export type Icon = keyof typeof Icons; 