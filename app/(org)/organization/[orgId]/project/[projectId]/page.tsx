// app/project/[projectId]/ClientProjectPage.tsx
"use client";

import { useProject } from "@/context/projectProvider";
import SprintCreationForm from "@/app/(org)/components/sprint-create";
import { useOrg } from "@/context/orgByIdProvider";
import { useOrgUser } from "@/context/OrgUserProvider";
import SprintManager from "@/app/(org)/components/sprint-manager";
import SprintBoard from "@/app/(org)/components/sprintBoard";

export default function ClientProjectPage() {
  const project = useProject();
  // console.log(project);
  const userOrgData = useOrgUser();
  const isAdmin = userOrgData?.role == "ADMIN";
  const projectTitle = project?.name;
  return (
    <div className="mx-auto container">
      <div className="flex flex-col gap-4 justify-between items-center mb-6 mt-5">
        <div className="backdrop-blur-xl bg-purple-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-3xl px-6 py-3 pb-5 w-fit flex justify-center items-center">
          <h1 className="text-6xl font-bold gradient-title">
            {projectTitle?.charAt(0).toUpperCase() + projectTitle.slice(1)}{" "}
            Project
          </h1>
        </div>
        {isAdmin && (
          <SprintCreationForm
            projectId={project?.id}
            projectKey={project?.key}
            sprintKey={project?.sprints.length + 1}
          />
        )}
      </div>
      {project?.sprints?.length > 0 ? (
        // <SprintBoard />
        <>
          <div className="flex flex-col">
            <SprintBoard
              sprints={project?.sprints}
              projectId={project?.id}
              orgId={project?.organizationId}
            />
          </div>
        </>
      ) : (
        <div className="text-2xl font-bold flex items-center justify-center">
          No Sprint
        </div>
      )}
    </div>
  );
}
