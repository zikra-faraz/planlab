"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import SprintManager from "./sprint-manager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import statuses from "@/data/status.json";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateIssueDrawer from "./createIssue";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issue";
import { SprintStatus, IssueStatus, IssuePriority } from "@prisma/client";
import { BarLoader } from "react-spinners";
import IssueCard from "./issueCard";
import BoardFilters from "./boardFilters";
import type { Sprint, Issue } from "@prisma/client";
import type { DropResult } from "@hello-pangea/dnd";
import { getUsersByOrgId } from "@/actions/organization";
type SprintBoardProps = {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function SprintBoard({
  sprints,
  projectId,
  orgId,
}: SprintBoardProps) {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users = [],
  } = useFetch(getUsersByOrgId, null);
  useEffect(() => {
    if (orgId) {
      fetchUsers(orgId);
    }
  }, [orgId]);
  const handleAddIssue = (status: string) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };
  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint, null);
  // console.log(issues);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues ?? []);
  const handleFilterChange = (newFilteredIssues: Issue[]) => {
    setFilteredIssues(newFilteredIssues);
  };
  useEffect(() => {
    if (currentSprint.id) {
      fetchIssues(currentSprint.id);
    }
  }, [currentSprint.id]);
  const handleIssueCreated = () => {
    fetchIssues(currentSprint.id);
  };
  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder, { success: false });
  const onDragEnd = async (result: DropResult) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData: Issue[] = [...(issues ?? [])];

    // source and destination list
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId
    );

    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(
        sourceList,
        source.index,
        destination.index
      );

      reorderedCards.forEach((card, i) => {
        card.order = i;
      });
    } else {
      // remove card from the source list
      const [movedCard] = sourceList.splice(source.index, 1);

      // assign the new list id to the moved card
      movedCard.status = destination.droppableId as IssueStatus;

      // add new card to the destination list
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => {
        card.order = i;
      });

      // update the order for each card in destination list
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    // const normalizedIssues = sortedIssues.map((issue) => ({
    //   ...issue,
    //   description: issue.description ?? null,
    //   assigneeId: issue.assigneeId ?? null,
    //   sprintId: issue.sprintId ?? null,
    // }));

    setIssues(sortedIssues);

    updateIssueOrderFn(sortedIssues);
  };

  if (issuesError) return <div>Error loadin issues</div>;
  return (
    <>
      <div className="flex flex-col">
        {/* sprint manager */}
        <SprintManager
          sprint={currentSprint}
          setSprint={setCurrentSprint}
          sprints={sprints}
          projectId={projectId}
        />

        {/* filter issues */}

        {issues && !issuesLoading && (
          <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
        )}
        {updateIssuesError && (
          <p className="text-red-500 mt-2">{updateIssuesError}</p>
        )}
        {updateIssuesLoading ||
          (issuesLoading && (
            <BarLoader
              className="mb-4"
              width={"100%"}
              color="#9333ea"
            ></BarLoader>
          ))}
        {/* Kanban board */}
        <DragDropContext onDragEnd={onDragEnd}>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4  p-4 rounded-lg border-1 border-gray-600 dark:border-white/5"> */}
          <Card className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 ">
            {statuses.map((st) => (
              <Droppable key={st.key} droppableId={st.key}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    <h3 className="font-semibold  text-center">{st.name}</h3>

                    {/* Issues */}
                    {filteredIssues
                      ?.filter((issue) => issue.status === st.key)
                      .map((issue, index) => (
                        <Draggable
                          key={issue.id}
                          draggableId={issue.id}
                          index={index}
                          isDragDisabled={updateIssuesLoading}
                        >
                          {(provided) => {
                            return (
                              <>
                                <div
                                  ref={provided.innerRef}
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                >
                                  <IssueCard
                                    issue={issue}
                                    onDelete={() =>
                                      fetchIssues(currentSprint.id)
                                    }
                                    onUpdate={(updated: Issue) =>
                                      setIssues((issues) =>
                                        issues?.map((issue) => {
                                          if (issue.id === updated.id)
                                            return updated;
                                          return issue;
                                        })
                                      )
                                    }
                                  />
                                </div>
                              </>
                            );
                          }}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                    {st.key === "TODO" &&
                      currentSprint.status !== "COMPLETED" && (
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => handleAddIssue(st.key)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Issue
                        </Button>
                      )}
                  </div>
                )}
              </Droppable>
            ))}
            {/* </div> */}
          </Card>
        </DragDropContext>
        <CreateIssueDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sprintId={currentSprint.id}
          status={selectedStatus}
          projectId={projectId}
          onIssueCreated={handleIssueCreated}
          orgId={orgId}
          users={users}
        />
      </div>
    </>
  );
}
