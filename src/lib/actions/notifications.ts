'use server';

import {deleteAllNotifications} from "@/lib/api/notifications/mutations";
import { revalidatePath } from "next/cache";

export const markAllNotificationsAsReadAction = async () => {
  await deleteAllNotifications();
  revalidatePath("/notifications")
}