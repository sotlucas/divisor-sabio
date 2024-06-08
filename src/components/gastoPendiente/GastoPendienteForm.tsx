import { z } from "zod";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/eventos/[eventoId]/useOptimisticGastoPendiente";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  type GastoPendiente,
  insertGastoPendienteParams,
} from "@/lib/db/schema/gastoPendiente";
import {
  createGastoPendienteAction,
  deleteGastoPendienteAction,
  updateGastoPendienteAction,
} from "@/lib/actions/gastoPendiente";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SaveButton } from "../SaveButton";
import { EventoId } from "@/lib/db/schema/eventos";
import { DeleteButton } from "../DeleteButton";

const GastoPendienteForm = ({
  participantes,
  eventoId,
  gastoPendiente,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  participantes?: any[];
  eventoId?: EventoId;
  gastoPendiente?: any;
  openModal?: (gastoPendiente?: GastoPendiente) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<GastoPendiente>(insertGastoPendienteParams);
  const editing = !!gastoPendiente?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();

  const onSuccess = (
    action: Action,
    data?: { error: string; values: GastoPendiente }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Ocurrió un error`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      if (action === "create") toast.success("Gasto pendiente creado!");
      if (action === "update") toast.success("Gasto pendiente actualizado!");
      if (action === "delete") toast.success("Gasto pendiente eliminado!");
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const gastoPendienteParsed =
      await insertGastoPendienteParams.safeParseAsync({ eventoId, ...payload });
    if (!gastoPendienteParsed.success) {
      setErrors(gastoPendienteParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = gastoPendienteParsed.data;
    const pendingGastoPendiente: GastoPendiente = {
      updatedAt: gastoPendiente?.updatedAt ?? new Date(),
      createdAt: gastoPendiente?.createdAt ?? new Date(),
      id: gastoPendiente?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingGastoPendiente,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateGastoPendienteAction({
              ...values,
              id: gastoPendiente.id,
            })
          : await createGastoPendienteAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingGastoPendiente,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    closeModal && closeModal();
    startMutation(async () => {
      addOptimistic &&
        addOptimistic({ action: "delete", data: gastoPendiente });
      const error = await deleteGastoPendienteAction(gastoPendiente?.id);
      setIsDeleting(false);
      const errorFormatted = {
        error: error ?? "Error",
        values: gastoPendiente,
      };

      onSuccess("delete", error ? errorFormatted : undefined);
    });
  };

  return (
    <form action={handleSubmit} onChange={handleChange}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.nombre ? "text-destructive" : ""
          )}
        >
          Nombre
        </Label>
        <Input
          type="text"
          name="nombre"
          placeholder="Carne"
          className={cn(errors?.nombre ? "ring ring-destructive" : "")}
          defaultValue={gastoPendiente?.nombre ?? ""}
        />
        {errors?.nombre ? (
          <p className="text-xs text-destructive mt-2">{errors.nombre[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.monto ? "text-destructive" : ""
          )}
        >
          Monto
        </Label>
        <Input
          type="text"
          name="monto"
          placeholder="0.00"
          className={cn(errors?.monto ? "ring ring-destructive" : "")}
          defaultValue={gastoPendiente?.monto ?? ""}
          required
        />
        {errors?.monto ? (
          <p className="text-xs text-destructive mt-2">{errors.monto[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.responsableId ? "text-destructive" : ""
          )}
        >
          Responsable
        </Label>
        <Select
          defaultValue={gastoPendiente?.responsableId as string}
          name="responsableId"
          disabled={editing}
          required
        >
          <SelectTrigger
            className={cn(errors?.responsableId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Seleccionar participante" />
          </SelectTrigger>
          <SelectContent>
            {participantes?.map((participante) => (
              <SelectItem
                key={participante.id}
                value={participante.id.toString()}
              >
                {participante.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.responsableId ? (
          <p className="text-xs text-destructive mt-2">
            {errors.responsableId[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <DeleteButton
          deleting={isDeleting}
          pending={pending}
          hasErrors={hasErrors}
          onClick={handleDelete}
        />
      ) : null}
    </form>
  );
};

export default GastoPendienteForm;
