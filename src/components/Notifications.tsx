'use client'

import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {OpenNotificationsButton} from "@/components/OpenNotificationsButton";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {NotificationsList} from "@/components/NotificationsList";
import {MarkAllNotificationsAsReadButton} from "@/components/MarkAllNotificationsAsReadButton";
import {useEffect, useState, useTransition} from "react";
import {markAllNotificationsAsReadAction} from "@/lib/actions/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [_pending, startMutation] = useTransition();
  const notificationsAmount = notifications.length;

  useEffect(() => {
    fetchNotifications();
    const refreshRateInSeconds = 10;
    const intervalId = setInterval(fetchNotifications, refreshRateInSeconds * 1000);

    return () => clearInterval(intervalId);
  }, []);

  async function fetchNotifications() {
    try {
      const response = await fetch('/api/notifications');
      const responseData = await response.json();
      const newNotifications = responseData.notifications;

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  function handleMarkAllAsRead() {
    setNotifications([]);

    markAllNotificationsAsReadAction();
  }

  return (
    <Popover>
      <PopoverTrigger className={"w-full"}>
        {/* The OpenNotificationsButton component is responsible for triggering a refresh
        in order to keep the notifications up to date.*/}
        <OpenNotificationsButton unreadNotifications={notificationsAmount}/>
      </PopoverTrigger>
      <PopoverContent side={"right"} align={"start"} className={"w-max"}>
        <Card className={"w-[380px] border-0"}>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>{`Tienes ${notificationsAmount} notificaciones sin leer.`}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <NotificationsList notifications={notifications}/>
          </CardContent>
          <CardFooter>
            <MarkAllNotificationsAsReadButton onClick={handleMarkAllAsRead}/>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}