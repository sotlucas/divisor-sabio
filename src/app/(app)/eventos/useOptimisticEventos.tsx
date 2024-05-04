
import { type Evento, type CompleteEvento } from "@/lib/db/schema/eventos";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Evento>) => void;

export const useOptimisticEventos = (
  eventos: CompleteEvento[],
  
) => {
  const [optimisticEventos, addOptimisticEvento] = useOptimistic(
    eventos,
    (
      currentState: CompleteEvento[],
      action: OptimisticAction<Evento>,
    ): CompleteEvento[] => {
      const { data } = action;

      

      const optimisticEvento = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticEvento]
            : [...currentState, optimisticEvento];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticEvento } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticEvento, optimisticEventos };
};
