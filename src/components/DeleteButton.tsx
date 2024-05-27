import {Button} from "@/components/ui/button";

export function DeleteButton(props: { deleting: any, pending: any, hasErrors: boolean, onClick: () => void }) {
  return <Button
    type="button"
    disabled={props.deleting || props.pending || props.hasErrors}
    variant={"destructive"}
    onClick={props.onClick}
  >
    {props.deleting ? "Eliminando..." : "Eliminar"}
  </Button>;
}