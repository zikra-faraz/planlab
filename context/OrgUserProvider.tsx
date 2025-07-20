// context/OrgUserProvider.tsx
"use client";

import { createContext, useContext } from "react";

type OrgUser = {
  user: any; // you can define a proper type if needed
  org: any;
  role: "ADMIN" | "MEMBER";
};

const OrgUserContext = createContext<OrgUser | null>(null);

export const OrgUserProvider = ({
  children,
  orgUser,
}: {
  children: React.ReactNode;
  orgUser: OrgUser;
}) => {
  return (
    <OrgUserContext.Provider value={orgUser}>
      {children}
    </OrgUserContext.Provider>
  );
};

export const useOrgUser = () => {
  const context = useContext(OrgUserContext);
  if (!context) {
    throw new Error("useOrgUser must be used inside OrgUserProvider");
  }
  return context;
};
