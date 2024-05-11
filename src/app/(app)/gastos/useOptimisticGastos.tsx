import { type Evento } from "@/lib/db/schema/eventos";
import { type Gasto, type CompleteGasto } from "@/lib/db/schema/gastos";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Gasto>) => void;

export const useOptimisticGastos = (
  gastos: CompleteGasto[],
  eventos: Evento[]
) => {
  const [optimisticGastos, addOptimisticGasto] = useOptimistic(
    gastos,
    (
      currentState: CompleteGasto[],
      action: OptimisticAction<Gasto>
    ): CompleteGasto[] => {
      const { data } = action;

      const optimisticEvento = eventos.find(
        (evento) => evento.id === data.eventoId
      )!;

      const optimisticGasto = {
        ...data,
        evento: optimisticEvento,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticGasto]
            : [...currentState, optimisticGasto];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticGasto } : item
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item
          );
        default:
          return currentState;
      }
    }
  );

  return { addOptimisticGasto, optimisticGastos };
};
