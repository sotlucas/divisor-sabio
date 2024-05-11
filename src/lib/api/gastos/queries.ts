import { db } from "@/lib/db/index";
import { type GastoId, gastoIdSchema } from "@/lib/db/schema/gastos";

export const getGastos = async () => {
  const g = await db.gasto.findMany({});
  return { gastos: g };
};

export const getGastoById = async (id: GastoId) => {
  const { id: gastoId } = gastoIdSchema.parse({ id });
  const g = await db.gasto.findFirst({
    where: { id: gastoId}});
  return { gasto: g };
};


