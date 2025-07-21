"use client";
import InviteButton from "@/app/(org)/components/Invite/InviteButton";
import ProjectList from "@/app/(org)/components/ProjectList";
import UpdateOrgModel from "@/app/(org)/components/updateOrgModel";
import { useProjects } from "@/context/getProjectsProvider";
import { useOrg } from "@/context/orgByIdProvider";
import { useOrgUser } from "@/context/OrgUserProvider";
import { log } from "console";
import React from "react";

const page = () => {
  const orgUser = useOrgUser();
  // console.log(orgUser);

  const orgId = orgUser?.org?.id;
  const InviterName = orgUser?.user?.name;

  // console.log(orgData.id);

  // console.log(userOrgData.org.id);
  const projects = useProjects();
  const isAdmin = orgUser?.role == "ADMIN";
  return (
    <>
      <div className="container mt-5 mx-auto px-4">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
          <div className="backdrop-blur-xl bg-purple-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-3xl px-6 py-3 pb-5 w-fit flex justify-center items-center">
            <h1 className="text-4xl font-bold gradient-title">
              {orgUser?.org?.name.charAt(0).toUpperCase() +
                orgUser?.org?.name.slice(1)}{" "}
              Organization
            </h1>
          </div>
          <div className="flex gap-2">
            <InviteButton
              orgId={orgId}
              inviterName={InviterName}
              isAdmin={isAdmin}
            />
            <UpdateOrgModel organization={orgId} isAdmin={isAdmin} />
          </div>
        </div>

        <div className="mb-4 ">
          <ProjectList orgId={orgId} projects={projects} isAdmin={isAdmin} />
        </div>
      </div>
    </>
  );
};

export default page;
