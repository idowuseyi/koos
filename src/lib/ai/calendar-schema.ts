import { z } from "zod";

// The AI returns day OFFSETS (0-based), never real dates — the server maps them
// onto a concrete startDate so dates can't be hallucinated.
export const calendarItemPlanSchema = z.object({
  dayOffset: z.number().int().nonnegative(),
  time: z.string().min(1),
  platform: z.string().min(1),
  contentType: z.string().min(1),
  title: z.string().min(1),
  brief: z.string().min(1),
  designRequired: z.boolean(),
  designType: z.string().optional(),
  dimensions: z.string().optional(),
});

export const calendarPlanSchema = z.object({
  items: z.array(calendarItemPlanSchema).min(1),
});

export type CalendarItemPlan = z.infer<typeof calendarItemPlanSchema>;
export type CalendarPlan = z.infer<typeof calendarPlanSchema>;
