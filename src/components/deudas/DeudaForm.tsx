import {z} from "zod";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {useValidatedForm} from "@/lib/hooks/useValidatedForm";

import {type Action, cn} from "@/lib/utils";
import {TAddOptimistic} from "@/app/(app)/eventos/[eventoId]/useOptimisticGastos";

import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useBackPath} from "@/components/shared/BackButton";

import {type Gasto, insertGastoParams} from "@/lib/db/schema/gastos";
import {createGastoAction, deleteGastoAction, updateGastoAction,} from "@/lib/actions/gastos";
import {type EventoId} from "@/lib/db/schema/eventos";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {SaveButton} from "@/components/SaveButton";
import {DeleteButton} from "@/components/DeleteButton";

const DeudaForm = ({
                     participantes,
                     eventoId,
                     gasto,
                     deudorId,
                     receptorId,
                     monto,
                     liquidatingEntireDeuda,
                     openModal,
                     closeModal,
                     addOptimistic,
                     postSuccess,
                   }: {
  participantes?: any[];
  gasto?: any;
  eventoId?: EventoId;
  deudorId?: string;
  receptorId?: string;
  monto?: number;
  liquidatingEntireDeuda?: boolean;
  openModal?: (gasto?: Gasto) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const {errors, hasErrors, setErrors, handleChange} =
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
      deudoresIds: [receptorId ?? payload.receptorId],
      pagadorId: deudorId ?? payload.deudorId,
      fecha: new Date(),
      nombre: "Deuda pagada",
      monto: monto ?? payload.monto,
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
          ? await updateGastoAction({...values, id: gasto.id})
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

  function handleDelete() {
    setIsDeleting(true);
    closeModal && closeModal();
    startMutation(async () => {
      addOptimistic && addOptimistic({action: "delete", data: gasto});
      const error = await deleteGastoAction(gasto.id);
      setIsDeleting(false);
      const errorFormatted = {
        error: error ?? "Error",
        values: gasto,
      };

      onSuccess("delete", error ? errorFormatted : undefined);
    });
  }

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
          defaultValue={deudorId}
          disabled={liquidatingEntireDeuda}
          required
        >
          <SelectTrigger
            className={cn(errors?.deudorId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Seleccionar participante"/>
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
          <div className="h-6"/>
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
          defaultValue={receptorId}
          disabled={liquidatingEntireDeuda}
          required
        >
          <SelectTrigger
            className={cn(errors?.receptorId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Seleccionar participante"/>
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
          <p className="text-xs text-destructive mt-2">
            {errors.receptorId[0]}
          </p>
        ) : (
          <div className="h-6"/>
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
            defaultValue={monto}
            disabled={liquidatingEntireDeuda}
            required
          />
        </div>
        {errors?.monto ? (
          <p className="text-xs text-destructive mt-2">{errors.monto[0]}</p>
        ) : (
          <div className="h-6"/>
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing}/>

      {/* Delete Button */}
      {editing ? (
        <DeleteButton deleting={isDeleting} pending={pending} hasErrors={hasErrors} onClick={handleDelete}/>
      ) : null}
    </form>
  );
};

export default DeudaForm;