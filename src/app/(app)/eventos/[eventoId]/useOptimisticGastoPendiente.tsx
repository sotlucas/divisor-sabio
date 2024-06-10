import {
  type GastoPendiente,
  type CompleteGastoPendiente,
} from "@/lib/db/schema/gastoPendiente";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<GastoPendiente>) => void;

export const useOptimisticGastoPendientes = (
  gastoPendiente: CompleteGastoPendiente[]
) => {
  const [optimisticGastoPendientes, addOptimisticGastoPendiente] =
    useOptimistic(
      gastoPendiente,
      (
        currentState: CompleteGastoPendiente[],
        action: OptimisticAction<GastoPendiente>
      ): any[] => {
        const { data } = action;

        const optimisticGastoPendiente = {
          ...data,
          id: "optimistic",
        };

        switch (action.action) {
          case "create":
            return currentState.length === 0
              ? [optimisticGastoPendiente]
              : [...currentState, optimisticGastoPendiente];
          case "update":
            return currentState.map((item) =>
              item.id === data.id
                ? { ...item, ...optimisticGastoPendiente }
                : item
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

  return { addOptimisticGastoPendiente, optimisticGastoPendientes };
};
