import {Button} from "@/components/ui/button";
import {useFormStatus} from "react-dom";

export function SaveButton(
  {
    editing,
    errors,
  }: {
    editing: boolean;
    errors: boolean;
  }) {
  const {pending} = useFormStatus();
  const isCreating = pending && !editing;
  const isUpdating = pending && editing;
  const crear = isCreating ? "Creando..." : "Crear";
  const editar = isUpdating ? "Guardando..." : "Guardar";

  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing ? editar : crear}
    </Button>
  );
}