"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import {
  disableNotificationsAction,
  enableNotificationsAction,
} from "@/lib/actions/notifications";

export default function Page() {
  const { setTheme } = useTheme();
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [_isPending, startMutation] = useTransition();

  useEffect(() => {
    if (enableNotifications) {
      startMutation(async () => {
        await enableNotificationsAction();
      });
    } else {
      startMutation(async () => {
        await disableNotificationsAction();
      });
    }
  }, [enableNotifications]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Configuración</h1>
      <div className="space-y-4 my-4">
        <div>
          <h3 className="text-lg font-medium">Tema</h3>
          <p className="text-sm text-muted-foreground">
            Personalice el tema de la app. Cambie inmediatamente entre tema
            claro y oscuro.
          </p>
        </div>
        <Button
          asChild
          variant={"ghost"}
          className="w-fit h-fit"
          onClick={() => setTheme("light")}
        >
          <div className="flex flex-col">
            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Claro
            </span>
          </div>
        </Button>
        <Button
          asChild
          variant={"ghost"}
          onClick={() => setTheme("dark")}
          className="w-fit h-fit"
        >
          <div className="flex flex-col">
            <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
              <div className="space-y-2 rounded-sm bg-neutral-950 p-2">
                <div className="space-y-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Oscuro
            </span>
          </div>
        </Button>
        <Button
          asChild
          variant={"ghost"}
          onClick={() => setTheme("system")}
          className="w-fit h-fit"
        >
          <div className="flex flex-col">
            <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
              <div className="space-y-2 rounded-sm bg-neutral-300 p-2">
                <div className="space-y-2 rounded-md bg-neutral-600 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-neutral-600 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-neutral-600 p-2 shadow-sm">
                  <div className="h-4 w-4 rounded-full bg-neutral-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-neutral-400" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Sistema
            </span>
          </div>
        </Button>
        <div className="flex flex-row items-center justify-between rounded-lg border p-4 max-w-[600px]">
          <div className="space-y-0.5">
            <h3 className="text-xl font-semibold">Notificaciones</h3>
            <p className="text-muted-foreground">
              Activar o desactivar notificaciones.
            </p>
          </div>
          <div>
            <Switch
              checked={enableNotifications}
              onCheckedChange={(checked) => setEnableNotifications(checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
