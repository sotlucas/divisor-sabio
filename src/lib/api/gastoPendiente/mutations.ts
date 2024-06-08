import { db } from "@/lib/db/index";
import {
  GastoPendienteId,
  NewGastoPendienteParams,
  UpdateGastoPendienteParams,
  updateGastoPendienteSchema,
  insertGastoPendienteSchema,
  gastoPendienteIdSchema,
} from "@/lib/db/schema/gastoPendiente";

export const createGastoPendiente = async (
  gastoPendiente: NewGastoPendienteParams
) => {
  console.log("PRE", gastoPendiente);
  const newGastoPendiente = insertGastoPendienteSchema.parse(gastoPendiente);
  console.log("DSADAS", newGastoPendiente);
  try {
    const g = await db.gastoPendiente.create({ data: newGastoPendiente });
    return { gastoPendiente: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateGastoPendiente = async (
  id: GastoPendienteId,
  gastoPendiente: UpdateGastoPendienteParams
) => {
  const { id: gastoPendienteId } = gastoPendienteIdSchema.parse({ id });
  const newGastoPendiente = updateGastoPendienteSchema.parse(gastoPendiente);
  try {
    const g = await db.gastoPendiente.update({
      where: { id: gastoPendienteId },
      data: newGastoPendiente,
    });
    return { gastoPendiente: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteGastoPendiente = async (id: GastoPendienteId) => {
  const { id: gastoPendienteId } = gastoPendienteIdSchema.parse({ id });
  try {
    const g = await db.gastoPendiente.delete({
      where: { id: gastoPendienteId },
    });
    return { gastoPendiente: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
