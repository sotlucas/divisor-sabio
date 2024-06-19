"use server";

import {
  deleteAllNotifications,
  disableNotifications,
  enableNotifications,
  getNotificationsConfig,
} from "@/lib/api/notifications/mutations";
import { revalidatePath } from "next/cache";

export const markAllNotificationsAsReadAction = async () => {
  await deleteAllNotifications();
  revalidatePath("/notifications");
};

export const enableNotificationsAction = async () => {
  await enableNotifications();
  revalidatePath("/notifications");
};

export const disableNotificationsAction = async () => {
  await disableNotifications();
  revalidatePath("/notifications");
};

export const getNotificationsConfigAction = async () => {
  const config = await getNotificationsConfig();
  revalidatePath("/notifications");
  return config;
};
