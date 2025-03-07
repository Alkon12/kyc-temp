'use client';

import React, { FC } from "react";
import MainNav from "./MainNav";
import { IUser } from "@/types/IUser";

export interface HeaderProps {
  className?: string;
  currentUser?: IUser | null;
  onLoginClick: () => void;
}

const Header: FC<HeaderProps> = ({ className = "", currentUser, onLoginClick }) => {
  return (
    <MainNav currentUser={currentUser} onLoginClick={onLoginClick} />
  );
};

export default Header;
