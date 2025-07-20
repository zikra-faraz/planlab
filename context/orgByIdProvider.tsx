"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Organization } from "@prisma/client";

const OrgContext = createContext<Organization | null>(null);

export const useOrg = () => useContext(OrgContext);

export const OrgByIdProvider = ({
  org,
  children,
}: {
  org: Organization;
  children: React.ReactNode;
}) => {
  return <OrgContext.Provider value={org}>{children}</OrgContext.Provider>;
};
