"use client";
import { useCurrentUser } from "@/context/UserProvider";
import React from "react";

const page = () => {
  const user = useCurrentUser();

  return <div>{user?.id}</div>;
};

export default page;
