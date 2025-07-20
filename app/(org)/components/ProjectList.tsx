import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Project } from "@prisma/client";

import DeleteProject from "./DeleteProject";
const ProjectList = ({
  orgId,
  projects,
  isAdmin,
}: {
  orgId: string;
  projects: Project[];
  isAdmin: boolean;
}) => {
  return (
    <div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {project.name.toUpperCase()}
                  {isAdmin && <DeleteProject projectId={project.id} />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-md text-gray-500 mb-4">
                  {project.description}
                </p>
                <Link
                  href={`/organization/apex/project/${project.id}`}
                  className="px-3 py-2 border rounded-lg "
                >
                  View Project -&gt;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
