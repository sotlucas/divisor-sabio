import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/gastos/useOptimisticGastos";

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

const GastoForm = ({
  eventos,
  eventoId,
  gasto,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  gasto?: Gasto | null;
  eventos: Evento[];
  eventoId?: EventoId;
  openModal?: (gasto?: Gasto) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Gasto>(insertGastoParams);
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
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Gasto ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const gastoParsed = await insertGastoParams.safeParseAsync({
      eventoId,
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
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
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
          className={cn(errors?.monto ? "ring ring-destructive" : "")}
          defaultValue={gasto?.monto ?? ""}
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
            errors?.nombre ? "text-destructive" : ""
          )}
        >
          Nombre
        </Label>
        <Input
          type="text"
          name="nombre"
          className={cn(errors?.nombre ? "ring ring-destructive" : "")}
          defaultValue={gasto?.nombre ?? ""}
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
            errors?.fecha ? "text-destructive" : ""
          )}
        >
          Fecha
        </Label>
        <br />
        <Popover>
          <Input
            name="fecha"
            onChange={() => {}}
            readOnly
            value={fecha?.toUTCString() ?? new Date().toUTCString()}
            className="hidden"
          />

          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !gasto?.fecha && "text-muted-foreground"
              )}
            >
              {fecha ? (
                <span>{format(fecha, "PPP")}</span>
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(e) => setFecha(e)}
              selected={fecha}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors?.fecha ? (
          <p className="text-xs text-destructive mt-2">{errors.fecha[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {eventoId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.eventoId ? "text-destructive" : ""
            )}
          >
            Evento
          </Label>
          <Select defaultValue={gasto?.eventoId} name="eventoId">
            <SelectTrigger
              className={cn(errors?.eventoId ? "ring ring-destructive" : "")}
            >
              <SelectValue placeholder="Select a evento" />
            </SelectTrigger>
            <SelectContent>
              {eventos?.map((evento) => (
                <SelectItem key={evento.id} value={evento.id.toString()}>
                  {evento.id}
                  {/* TODO: Replace with a field from the evento model */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.eventoId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.eventoId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
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
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default GastoForm;

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
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
