import * as z from "zod";

import { NotificationPreferenceEnum } from "@/drizzle/schema";

export const NotificationPreferenceEnumSchema = z.enum(
  NotificationPreferenceEnum.enumValues
);
