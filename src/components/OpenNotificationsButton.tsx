import {Badge} from "@/components/ui/badge"
import {Bell} from "lucide-react";

export function OpenNotificationsButton(props: { unreadNotifications: number }) {
  const hasUnreadNotifications = props.unreadNotifications > 0;

  return (
    <div
      className={"transition-colors p-2 inline-block bg-muted hover:bg-popover hover:text-primary " +
        "text-muted-foreground text-xs hover:shadow rounded-md w-full font-semibold " +
        (hasUnreadNotifications ? "text-primary" : "")}
    >
      <div className={"flex items-center"}>
        <Bell className={"h-3.5 mr-1"}/>
        <span>{"Notificaciones"}</span>
        {hasUnreadNotifications &&
          <Badge variant={"destructive"} className={"ml-2.5 bg-red-500 text-white pl-1.5 pr-1.5 text-xs"}>
            {props.unreadNotifications}
          </Badge>
        }
      </div>
    </div>
  );
}