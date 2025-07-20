"use client";
import InviteButton from "@/app/(org)/components/Invite/InviteButton";
import UpdateOrgModel from "@/app/(org)/components/updateOrgModel";
import { useProjects } from "@/context/getProjectsProvider";
import { useOrg } from "@/context/orgByIdProvider";
import { useOrgUser } from "@/context/OrgUserProvider";
import { log } from "console";
import React from "react";

const page = () => {
  const userOrgData = useOrgUser();
  const orgId = userOrgData?.org?.id;
  const InviterName = userOrgData?.user?.name;

  // console.log(orgData.id);

  // console.log(userOrgData.org.id);

  const isAdmin = userOrgData?.role == "ADMIN";
  return (
    <>
      <div className="container mt-5 mx-auto px-4">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
          <div className="backdrop-blur-xl bg-purple-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-3xl px-6 py-3 pb-5 w-fit flex justify-center items-center">
            <h1 className="text-4xl font-bold gradient-title">
              {userOrgData?.org?.name.charAt(0).toUpperCase() +
                userOrgData?.org?.name.slice(1)}{" "}
              Organization
            </h1>
          </div>
          <div className="flex gap-2">
            <InviteButton
              orgId={orgId}
              inviterName={InviterName}
              isAdmin={isAdmin}
            />
            <UpdateOrgModel organization={userOrgData.org} isAdmin={isAdmin} />
          </div>
        </div>

        <div className="mb-4 ">
          {/* <ProjectList orgId={orgData?.id} projects={projects} /> */}
        </div>
      </div>
    </>
  );
};

export default page;
