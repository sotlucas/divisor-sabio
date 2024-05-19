"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addParticipantAction } from "@/lib/actions/eventos";
import { AuthSession } from "@/lib/auth/utils";
import { Evento } from "@/lib/db/schema/eventos";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export const OptimisticInvite = ({
  evento,
  session,
}: {
  evento: Evento;
  session: AuthSession["session"];
}) => {
  const [pending, startMutation] = useTransition();

  const onClickHandler = async () => {
    startMutation(async () => {
      const error = await addParticipantAction(evento.id);
      if (error) {
        toast.error("Ocurrió un error");
      }
      toast.success("Te uniste al evento!");
      redirect(`/eventos/${evento.id}`);
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex items-center">
          <h1>Te invitaron a unirte al evento</h1>
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {evento.nombre}
          </h2>
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-col">
          <Button
            className="w-full"
            type="submit"
            onClick={onClickHandler}
            disabled={pending}
          >
            {pending ? "Uniendo..." : "Unirme"}
          </Button>
        </CardContent>
      </Card>
      <div className="mt-4 text-sm text-center text-muted-foreground">
        Logueado como: {session?.user.email}
      </div>
    </>
  );
};
