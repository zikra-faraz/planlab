"use client";

import { createContext, useContext } from "react";
type User = {
  id: string;
  email: string;
  name: string;
  image: string;
  accounts: {
    provider: string;
  }[];
  organizations: {
    role: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
};
type UserContextType = {
  user: User | null;
};
const UserContext = createContext<UserContextType>({
  user: null,
});

export const useCurrentUser = () => useContext(UserContext);
type UserProviderProps = {
  user: User | null;
  children: React.ReactNode;
};
export const UserProvider = ({
  user,

  children,
}: UserProviderProps) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
