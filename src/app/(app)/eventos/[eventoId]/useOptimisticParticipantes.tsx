import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<any>) => void;

export const useOptimisticParticipantes = (participantes: any) => {
  const [optimisticParticipantes, addOptimisticParticipantes] = useOptimistic(
    participantes,
    (currentState: any[], action: OptimisticAction<any>): any[] => {
      const { data } = action;

      switch (action.action) {
        case "delete":
          return currentState.filter((item) => item.id !== data.id);
        default:
          return currentState;
      }
    }
  );

  return {
    addOptimisticParticipantes,
    optimisticParticipantes,
  };
};
