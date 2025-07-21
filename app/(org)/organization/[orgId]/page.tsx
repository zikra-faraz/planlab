"use client";
import { useProjects } from "@/context/getProjectsProvider";
import ProjectList from "../../components/ProjectList";
import { Button } from "@/components/ui/button";
import { useOrg } from "@/context/orgByIdProvider";
import { Plus, Settings } from "lucide-react";

import Link from "next/link";
import { useOrgUser } from "@/context/OrgUserProvider";
export default function Organization() {
  const orgData = useOrg();
  // console.log(orgData);

  const projects = useProjects();
  const slug = orgData?.slug;
  // console.log(slug);

  const userOrgData = useOrgUser();
  const isAdmin = userOrgData?.role == "ADMIN";
  // console.log(userOrgData);

  return (
    <>
      <div className="container mt-5 mx-auto px-4">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
          <div className="backdrop-blur-xl bg-purple-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-3xl px-6 py-3 pb-5 w-fit flex justify-center items-center">
            <h1 className="text-4xl font-bold gradient-title">
              {orgData?.name.charAt(0).toUpperCase() + orgData?.name.slice(1)}{" "}
              Organization
            </h1>
          </div>
          {isAdmin && slug && (
            <>
              {" "}
              <div>
                <Link
                  href={`/organization/${slug}/settings`}
                  className="flex items-center gap-1 py-2 px-3  border-2 rounded-xl "
                >
                  <Button variant="ghost">
                    <Settings size={16} /> Settings
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
        {isAdmin && (
          <div className="mb-4 ">
            <Link href={`/organization/${slug}/create-project`}>
              <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 cursor-pointer ">
                <Plus size={18} className="text-white" />
                <span className=" md:inline text-white">Create Project</span>
              </Button>
            </Link>
          </div>
        )}
        <div className="mb-4 ">
          <ProjectList
            orgId={orgData?.id}
            projects={projects}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </>
  );
}
