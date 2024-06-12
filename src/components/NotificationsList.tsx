'use client'

import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

export function NotificationsList({notifications}: {
  notifications: {
    message: string;
    createdAt: string;
    eventoId: string;
  }[]
}) {
  const router = useRouter();

  function timeSinceNotifiedText(createdAt: string) {
    const timeInMilliseconds = Date.now() - Date.parse(createdAt);
    const timeInMinutes = Math.floor(timeInMilliseconds / 1000 / 60);
    if (timeInMinutes < 1) return "hace unos segundos";
    if (timeInMinutes < 60) return `hace ${timeInMinutes} ${timeInMinutes == 1 ? "minuto" : "minutos"}`;

    const timeInHours = Math.floor(timeInMinutes / 60);
    if (timeInHours < 24) return `hace ${timeInHours} ${timeInHours == 1 ? "hora" : "horas"}`;

    const timeInDays = Math.floor(timeInHours / 24);
    return `hace ${timeInDays} ${timeInDays == 1 ? "día" : "días"}`;
  }

  return (
    <ScrollArea className={"mh-80"}>
      {notifications.map((notification, index) => (
        <Button
          variant={"ghost"}
          key={index}
          className="mb-4 grid grid-cols-[25px_1fr] items-start p-2 last:mb-0 text-left h-min"
          onClick={() => {
            console.log("redirect to " + notification.eventoId)
            router.replace("/eventos/" + notification.eventoId + "/gastos");
          }}
        >
          <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
          <div className="space-y-1">
            <p style={{lineHeight: "20px"}} className="text-sm font-medium leading-none text-wrap">
              {notification.message}
            </p>
            <p className="text-sm text-muted-foreground">
              {timeSinceNotifiedText(notification.createdAt)}
            </p>
          </div>
        </Button>
      ))}
    </ScrollArea>
  );
}