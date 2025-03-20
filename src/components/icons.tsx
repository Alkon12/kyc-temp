import { LucideProps, Loader2, LogIn } from "lucide-react";

export const Icons = {
  logo: LogIn,
  spinner: Loader2,
};

export type Icon = keyof typeof Icons; 