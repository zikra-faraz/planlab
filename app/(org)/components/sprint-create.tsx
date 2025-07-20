"use client";
import { createSprint } from "@/actions/sprint";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format, addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { sprintSchema, sprintSchemaType } from "@/app/(org)/lib/validators";
import Link from "next/link";
import { checkSprintStatus } from "@/actions/sprint";

export default function SprintCreationForm({
  projectKey,
  projectId,
  sprintKey,
}: {
  projectKey: string;
  projectId: string;
  sprintKey: number;
}) {
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 14),
  });
  const [disableCreate, setDisableCreate] = useState(false);

  const router = useRouter();
  const { loading: createSprintLoading, fn: createSprintFn } = useFetch(
    createSprint,
    null
  );

  useEffect(() => {
    const fetchStatus = async () => {
      const exists = await checkSprintStatus(projectId); // ✅ call action
      setDisableCreate(exists); // true = disable
    };

    fetchStatus();
  }, [projectId]);
  // if (userOrg) console.log(userOrg);

  // control is used when using third party  packags lik here reactt day picker
  // console.log(projectTitle);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from ?? new Date(),
      endDate: dateRange.to ?? new Date(),
    },
  });
  const onSubmit = async (data: sprintSchemaType) => {
    const res = await createSprintFn({
      ...data,
      projectId,
      startDate: dateRange.from!,
      endDate: dateRange.to,
    });

    setShowForm(false);
    if (res) {
      toast.success("sprint created successfully");
    }
    router.refresh();
  };

  return (
    <>
      <Button
        disabled={disableCreate}
        className={`z-10 ${
          !showForm ? "" : "bg-red-700 hover:bg-red-800 text-white"
        } cursor-pointer`}
        onClick={() => setShowForm(!showForm)}
      >
        {!showForm ? "Create New Sprint" : "Cancel"}
      </Button>

      {showForm && (
        <>
          <Card className="pt-4 mb-4 z-10">
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-4 items-end"
              >
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1 "
                  >
                    Sprint name
                  </label>
                  <Input id="name" readOnly {...register("name")} />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Sprint Duration
                  </label>
                  <Controller
                    control={control}
                    name="startDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal  ${
                              !dateRange && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from && dateRange.to ? (
                              format(dateRange.from, "LLL dd, y") +
                              " - " +
                              format(dateRange.to, "LLL dd, y")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto dark:bg-black "
                          align="start"
                        >
                          <DayPicker
                            classNames={{
                              chevron: "fill-blue-500",
                              range_start: "bg-blue-700",
                              range_end: "bg-blue-700",
                              range_middle: "bg-blue-400",
                              day_button: "border-none",
                              today: "border-2 border-blue-700",
                            }}
                            mode="range"
                            disabled={[{ before: new Date() }]}
                            selected={dateRange}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                setDateRange(range);
                                field.onChange(range);
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createSprintLoading}
                  className="cursor-pointer z-10"
                >
                  {createSprintLoading ? "Creating..." : "Create Sprint"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
