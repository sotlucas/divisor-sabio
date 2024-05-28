import {z} from "zod";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {useValidatedForm} from "@/lib/hooks/useValidatedForm";

import {type Action, cn} from "@/lib/utils";
import {TAddOptimistic} from "@/app/(app)/eventos/[eventoId]/useOptimisticGastos";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {format} from "date-fns";

import {type Gasto, insertGastoParams, NewGasto, NewGastoParams} from "@/lib/db/schema/gastos";
import {createGastoAction, deleteGastoAction, updateGastoAction,} from "@/lib/actions/gastos";
import {type EventoId} from "@/lib/db/schema/eventos";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {es} from "date-fns/locale";
import {Checkbox} from "@/components/ui/checkbox";
import {SaveButton} from "@/components/SaveButton";
import {DeleteButton} from "@/components/DeleteButton";

const GastoForm = ({
                     participantes,
                     eventoId,
                     gasto,
                     openModal,
                     closeModal,
                     addOptimistic,
                     postSuccess,
                   }: {
  participantes?: any[];
  gasto?: any;
  eventoId?: EventoId;
  openModal?: (gasto?: Gasto) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const {errors, hasErrors, setErrors, handleChange} =
    useValidatedForm<NewGastoParams>(insertGastoParams);
  const editing = !!gasto?.id;
  const [fecha, setFecha] = useState<Date | undefined>(gasto?.fecha);

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();

  const deudoresIdsDelGastoEditado = gasto?.deudas?.map((deuda: { deudorId: string; }) => deuda.deudorId)
  const participantesIds = participantes?.map(participante => participante.id) || [];
  const [deudoresGastoNuevoOEditado, setDeudoresGastoNuevoOEditado] = useState<string[]>(deudoresIdsDelGastoEditado || participantesIds)

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
      deudoresIds: deudoresGastoNuevoOEditado ?? [],
      pagadorId: payload.pagadorId ?? gasto?.pagadorId,
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
          defaultValue={gasto?.nombre ?? ""}
          required
        />
        {errors?.nombre ? (
          <p className="text-xs text-destructive mt-2">{errors.nombre[0]}</p>
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
            defaultValue={gasto?.monto ?? ""}
            required
          />
        </div>
        {errors?.monto ? (
          <p className="text-xs text-destructive mt-2">{errors.monto[0]}</p>
        ) : (
          <div className="h-6"/>
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
        <br/>
        <Popover>
          <Input
            name="fecha"
            onChange={() => {
            }}
            readOnly
            value={fecha?.toUTCString() ?? new Date().toUTCString()}
            className="hidden"
            required
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
                <span>{format(fecha, "PPP", {locale: es})}</span>
              ) : (
                <span>Elegir una fecha</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(e) => setFecha(e)}
              selected={fecha}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
        {errors?.fecha ? (
          <p className="text-xs text-destructive mt-2">{errors.fecha[0]}</p>
        ) : (
          <div className="h-6"/>
        )}
      </div>
      <div>
        <Label
          className={cn(
            errors?.deudoresIds ? "mb-2 inline-block text-destructive" : "mb-2 inline-block"
          )}
        >
          Adeudado por
        </Label>
        {participantes?.map(((participante: any) => {
          const idParticipanteActual = participante.id;

          return (
            <div key={idParticipanteActual} className="mb-2 block">
              <div>
                <Checkbox
                  value={idParticipanteActual}
                  checked={deudoresGastoNuevoOEditado?.includes(idParticipanteActual)}
                  onCheckedChange={(checked) => {
                    if (errors?.deudoresIds && checked)
                      setErrors({...errors, deudoresIds: undefined})

                    return checked
                      ? setDeudoresGastoNuevoOEditado([...deudoresGastoNuevoOEditado, idParticipanteActual])
                      : setDeudoresGastoNuevoOEditado(
                        deudoresGastoNuevoOEditado?.filter(
                          (deudorId) => deudorId !== idParticipanteActual
                        )
                      )
                  }}
                  className={cn(errors?.deudoresIds ? "mr-2 align-middle ring ring-destructive" : "mr-2 align-middle")}
                />
                <Label className={"mb-2 align-middle"}>{participante.name}</Label>
              </div>
            </div>)
        }))}
        {errors?.deudoresIds ? (
          <p className="text-destructive h-6 text-xs">{"Debe seleccionar al menos 1 deudor."}</p>
        ) : (
          <div className="h-6"/>
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.pagadorId ? "text-destructive" : ""
          )}
        >
          Pagado por
        </Label>
        <Select
          defaultValue={gasto?.pagadorId}
          name="pagadorId"
          disabled={editing}
          required
        >
          <SelectTrigger
            className={cn(errors?.pagadorId ? "ring ring-destructive" : "")}
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
        {errors?.pagadorId ? (
          <p className="text-xs text-destructive mt-2">{errors.pagadorId[0]}</p>
        ) : (
          <div className="h-6"/>
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing}/>

      {editing ? (
        /* Delete Button */
        <DeleteButton deleting={isDeleting} pending={pending} hasErrors={hasErrors} onClick={handleDelete}/>
      ) : null}
    </form>
  );
};

export default GastoForm;

