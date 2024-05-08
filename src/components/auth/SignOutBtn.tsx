"use client";

import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import { signOutAction } from "@/lib/actions/users";

export default function SignOutBtn() {
  return (
    <form action={signOutAction} className="w-full text-left">
      <Btn />
    </form>
  );
}

const Btn = () => {
  const { pending } = useFormStatus();
  const text = pending ? "Cerrando sesión" : "Cerrar sesión";
  return (
    <Button type="submit" disabled={pending} variant={"destructive"}>
      {text}
    </Button>
  );
};
