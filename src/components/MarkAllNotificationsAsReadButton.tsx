'use client'

import {Button} from "@/components/ui/button";
import {Check} from "lucide-react";

export function MarkAllNotificationsAsReadButton(props: {onClick: () => void}) {
  return (
    <Button
      className="w-full"
      onClick={props.onClick}
    >
      <Check className="mr-2 h-4 w-4"/>
      <span>
      {"Marcar todo como leído"}
    </span>
    </Button>
  );
}