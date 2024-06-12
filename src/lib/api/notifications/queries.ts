import {getUserAuth} from "@/lib/auth/utils";
import {db} from "@/lib/db";

export const getNotifications = async () => {
  const {session} = await getUserAuth();
  if (!session) {
    return {notifications: []}
  }

  const allNotifications = await db.notification.findMany({
    where: {
      userId: session?.user.id!,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return {notifications: allNotifications}
}