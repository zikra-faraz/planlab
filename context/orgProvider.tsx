"use client";

import { createContext, useContext } from "react";

type Org = {
  id: string;
  name: string;
  slug: string;
};

const OrgContext = createContext<Org[]>([]);

export const useOrgs = () => useContext(OrgContext);

export const OrgProvider = ({
  orgs,
  children,
}: {
  orgs: Org[];
  children: React.ReactNode;
}) => {
  return <OrgContext.Provider value={orgs}>{children}</OrgContext.Provider>;
};
