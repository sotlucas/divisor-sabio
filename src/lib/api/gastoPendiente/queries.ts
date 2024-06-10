import { db } from "@/lib/db/index";
import {
  type GastoPendienteId,
  gastoPendienteIdSchema,
} from "@/lib/db/schema/gastoPendiente";

export const getGastoPendientes = async () => {
  const g = await db.gastoPendiente.findMany({});
  return { gastoPendiente: g };
};

export const getGastoPendienteById = async (id: GastoPendienteId) => {
  const { id: gastoPendienteId } = gastoPendienteIdSchema.parse({ id });
  const g = await db.gastoPendiente.findFirst({
    where: { id: gastoPendienteId },
  });
  return { gastoPendiente: g };
};
