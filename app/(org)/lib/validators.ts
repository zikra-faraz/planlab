import { z } from "zod";
export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),
  key: z
    .string()
    .min(2, "Project key must be at least 2 characters")
    .max(10, "Project key must be 10 characters or less")
    .toUpperCase(),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
});

export type ProjectSchemaType = z.infer<typeof projectSchema>;

//type CreateProjectData = {
//   name: string;
//   key: string;
//   description?: string;
// };

export const sprintSchema = z.object({
  name: z.string().min(1, "Sprint name is required"),
  startDate: z.date(),
  endDate: z.date(),
});
// .refine((data) => data.startDate && data.endDate, {
//   message: "Start and end dates are required",
//   path: ["startDate"], // show the error on the startDate field
// });

export type sprintSchemaType = z.infer<typeof sprintSchema>;

export const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assigneeId: z.string().cuid("Please select assignee"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});
