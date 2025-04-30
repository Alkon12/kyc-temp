import { 
  LucideProps, 
  Loader2, 
  LogIn, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  PanelLeft,
  PanelRight,
  Building2,
  FileCheck
} from "lucide-react";

export const Icons = {
  logo: LogIn,
  spinner: Loader2,
  dashboard: LayoutDashboard,
  users: Users,
  settings: Settings,
  logout: LogOut,
  menu: Menu,
  close: X,
  panelLeft: PanelLeft,
  panelRight: PanelRight,
  building: Building2,
  fileCheck: FileCheck
};

export type Icon = keyof typeof Icons; 