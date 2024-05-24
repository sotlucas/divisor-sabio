import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { TAddOptimistic } from "@/app/(app)/eventos/[eventoId]/useOptimisticGastos";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { type Gasto, insertGastoParams } from "@/lib/db/schema/gastos";
import {
  createGastoAction,
  deleteGastoAction,
  updateGastoAction,
} from "@/lib/actions/gastos";
import { type Evento, type EventoId } from "@/lib/db/schema/eventos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { es } from "date-fns/locale";

const DeudaForm = ({
  participantes,
  eventoId,
  gasto,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  participantes?: any[];
  gasto?: Gasto | null;
  eventoId?: EventoId;
  openModal?: (gasto?: Gasto) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<any>(insertGastoParams); // TODO: fix type
  const editing = !!gasto?.id;
  const [fecha, setFecha] = useState<Date | undefined>(gasto?.fecha);

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("gastos");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Gasto }
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
      if (action === "create") toast.success("Gasto creado!");
      if (action === "update") toast.success("Gasto actualizado!");
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());

    const gastoParsed = await insertGastoParams.safeParseAsync({
      eventoId,
      deudoresIds: [payload.receptorId],
      pagadorId: payload.deudorId,
      fecha: new Date(),
      nombre: "Deuda pagada",
      ...payload,
    });
    if (!gastoParsed.success) {
      setErrors(gastoParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = gastoParsed.data;
    const pendingGasto: Gasto = {
      updatedAt: gasto?.updatedAt ?? new Date(),
      createdAt: gasto?.createdAt ?? new Date(),
      id: gasto?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingGasto,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateGastoAction({ ...values, id: gasto.id })
          : await createGastoAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingGasto,
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

  return (
    <form action={handleSubmit} onChange={handleChange}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.deudorId ? "text-destructive" : ""
          )}
        >
          Deudor
        </Label>
        <Select
          name="deudorId"
          required
        >
          <SelectTrigger
            className={cn(errors?.deudorId ? "ring ring-destructive" : "")}
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
        {errors?.deudorId ? (
          <p className="text-xs text-destructive mt-2">{errors.deudorId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.receptorId ? "text-destructive" : ""
          )}
        >
          Receptor
        </Label>
        <Select
          name="receptorId"
          required
        >
          <SelectTrigger
            className={cn(errors?.receptorId ? "ring ring-destructive" : "")}
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
        {errors?.receptorId ? (
          <p className="text-xs text-destructive mt-2">{errors.receptorId[0]}</p>
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
        <div className="flex items-baseline gap-2">
          <span>$</span>
          <Input
            type="text"
            name="monto"
            placeholder="0.00"
            className={cn(errors?.monto ? "ring ring-destructive" : "")}
            defaultValue={gasto?.monto ?? ""}
            required
          />
        </div>
        {errors?.monto ? (
          <p className="text-xs text-destructive mt-2">{errors.monto[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: gasto });
              const error = await deleteGastoAction(gasto.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: gasto,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </Button>
      ) : null}
    </form>
  );
};

export default DeudaForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
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
};
