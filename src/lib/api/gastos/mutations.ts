import { db } from "@/lib/db/index";
import { 
  GastoId, 
  NewGastoParams,
  UpdateGastoParams, 
  updateGastoSchema,
  insertGastoSchema, 
  gastoIdSchema 
} from "@/lib/db/schema/gastos";

export const createGasto = async (gasto: NewGastoParams) => {
  const newGasto = insertGastoSchema.parse(gasto);
  try {
    const g = await db.gasto.create({ data: newGasto });
    return { gasto: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateGasto = async (id: GastoId, gasto: UpdateGastoParams) => {
  const { id: gastoId } = gastoIdSchema.parse({ id });
  const newGasto = updateGastoSchema.parse(gasto);
  try {
    const g = await db.gasto.update({ where: { id: gastoId }, data: newGasto})
    return { gasto: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteGasto = async (id: GastoId) => {
  const { id: gastoId } = gastoIdSchema.parse({ id });
  try {
    const g = await db.gasto.delete({ where: { id: gastoId }})
    return { gasto: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

