import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/eventos/useOptimisticEventos";

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
import { es } from "date-fns/locale";

import { type Evento, insertEventoParams } from "@/lib/db/schema/eventos";
import {
  createEventoAction,
  deleteEventoAction,
  updateEventoAction,
} from "@/lib/actions/eventos";
import { Textarea } from "../ui/textarea";

const EventoForm = ({
  evento,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  evento?: Evento | null;
  openModal?: (evento?: Evento) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Evento>(insertEventoParams);
  const editing = !!evento?.id;
  const [fechaInicio, setFechaInicio] = useState<any>(evento?.fechaInicio);

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("eventos");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Evento }
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
      if (action === "create") toast.success("Evento creado!");
      if (action === "update") toast.success("Evento actualizado!");
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const eventoParsed = await insertEventoParams.safeParseAsync({
      ...payload,
    });
    if (!eventoParsed.success) {
      setErrors(eventoParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = eventoParsed.data;
    const pendingEvento: Evento = {
      updatedAt: evento?.updatedAt ?? new Date(),
      createdAt: evento?.createdAt ?? new Date(),
      id: evento?.id ?? "",
      userId: evento?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingEvento,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateEventoAction({ ...values, id: evento.id })
          : await createEventoAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingEvento,
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
            errors?.nombre ? "text-destructive" : ""
          )}
        >
          Nombre
        </Label>
        <Input
          type="text"
          name="nombre"
          placeholder="Asado"
          className={cn(errors?.nombre ? "ring ring-destructive" : "")}
          defaultValue={evento?.nombre ?? ""}
          required={true}
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
            errors?.descripcion ? "text-destructive" : ""
          )}
        >
          Descripción
        </Label>
        <Textarea
          name="descripcion"
          placeholder="Descripción del evento..."
          className={cn(errors?.descripcion ? "ring ring-destructive" : "")}
          defaultValue={evento?.descripcion ?? ""}
        />
        {errors?.descripcion ? (
          <p className="text-xs text-destructive mt-2">
            {errors.descripcion[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.fechaInicio ? "text-destructive" : ""
          )}
        >
          Fecha Inicio
        </Label>
        <br />
        <Popover>
          <Input
            name="fechaInicio"
            onChange={() => {}}
            readOnly
            value={fechaInicio?.toUTCString() ?? new Date().toUTCString()}
            className="hidden"
          />

          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !evento?.fechaInicio && "text-muted-foreground"
              )}
            >
              {fechaInicio ? (
                <span>{format(fechaInicio, "PPP", { locale: es })}</span>
              ) : (
                <span>Elegir una fecha</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(e) => setFechaInicio(e)}
              selected={fechaInicio}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
        {errors?.fechaInicio ? (
          <p className="text-xs text-destructive mt-2">
            {errors.fechaInicio[0]}
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
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic &&
                addOptimistic({ action: "delete", data: evento });
              const error = await deleteEventoAction(evento.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: evento,
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

export default EventoForm;

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
