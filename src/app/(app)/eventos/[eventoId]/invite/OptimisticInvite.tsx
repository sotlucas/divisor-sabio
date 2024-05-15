"use client";

import { Button } from "@/components/ui/button";
import { addParticipantAction } from "@/lib/actions/eventos";
import { Evento } from "@/lib/db/schema/eventos";
import { redirect } from "next/navigation";
import { useTransition } from "react";

export const OptimisticInvite = ({ evento }: { evento: Evento }) => {
  const [pending, startMutation] = useTransition();

  const onClickHandler = async () => {
    startMutation(async () => {
      await addParticipantAction(evento.id);
      redirect(`/eventos/${evento.id}`);
    });
  };
  return (
    <>
      <h1>{evento.nombre}</h1>
      <Button onClick={onClickHandler}>Unirse</Button>
    </>
  );
};
