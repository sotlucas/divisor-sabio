import { db } from "@/lib/db";
import { getUserAuth } from "@/lib/auth/utils";

export const deleteAllNotifications = async () => {
  const { session } = await getUserAuth();
  if (!session) {
    return { notifications: [] };
  }

  await db.notification.deleteMany({
    where: {
      userId: session?.user.id!,
    },
  });
};

export const enableNotifications = async () => {
  const { session } = await getUserAuth();
  if (!session) {
    return { notifications: [] };
  }

  await db.user.update({
    where: { id: session?.user.id },
    data: {
      recibirNotificaciones: true,
    },
  });
};

export const disableNotifications = async () => {
  const { session } = await getUserAuth();
  if (!session) {
    return { notifications: [] };
  }

  await db.user.update({
    where: { id: session?.user.id },
    data: {
      recibirNotificaciones: false,
    },
  });
};

export const getNotificationsConfig = async () => {
  const { session } = await getUserAuth();
  if (!session) {
    return { recibirNotificaciones: false };
  }

  const user = await db.user.findFirst({
    where: { id: session?.user.id },
    select: { recibirNotificaciones: true },
  });

  return { recibirNotificaciones: user?.recibirNotificaciones ?? false };
};
