'use client'

import {Button} from "@/components/ui/button";
import {Check} from "lucide-react";
import {useTransition} from "react";
import {markAllNotificationsAsReadAction} from "@/lib/actions/notifications";

export function MarkAllNotificationsAsReadButton() {
  const [_isPending, startMutation] = useTransition();

  function handleMarkAllAsRead() {
    startMutation(async () => {
      await markAllNotificationsAsReadAction();
    })
  }

  return (
    <Button
      className="w-full"
      onClick={handleMarkAllAsRead}
    >
      <Check className="mr-2 h-4 w-4"/>
      <span>
      {"Marcar todo como leído"}
    </span>
    </Button>
  );
}