import { db } from "@/lib/db/index";
import {
  GastoId,
  NewGastoParams,
  UpdateGastoParams,
  updateGastoSchema,
  insertGastoSchema,
  gastoIdSchema,
} from "@/lib/db/schema/gastos";
import { getUserAuth } from "@/lib/auth/utils";

export const createGasto = async (gasto: NewGastoParams) => {
  const newGasto = insertGastoSchema.parse(gasto);

  const deudas = gasto?.deudoresIds.map((deudorId) => ({
    deudor: { connect: { id: deudorId } },
    monto: newGasto.monto / gasto?.deudoresIds.length,
  }));

  try {
    const g = await db.gasto.create({
      data: {
        ...newGasto,
        deudas: {
          create: deudas,
        },
      },
    });
    return { gasto: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateGasto = async (id: GastoId, gasto: UpdateGastoParams) => {
  const { session } = await getUserAuth();
  const { id: gastoId } = gastoIdSchema.parse({ id });
  const newGasto = updateGastoSchema.parse(gasto);
  const gastoWithDeudas = await db.gasto.findFirst({
    where: { id: gastoId },
    include: { deudas: true },
  });
  try {
    const g = await db.gasto.update({
      where: { id: gastoId, pagadorId: session?.user.id },
      data: {
        ...newGasto,
        deudas: {
          updateMany: gastoWithDeudas?.deudas.map((deuda) => ({
            where: { id: deuda.id },
            data: { monto: newGasto.monto / gastoWithDeudas?.deudas.length },
          })),
        },
      },
    });
    return { gasto: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteGasto = async (id: GastoId) => {
  const { session } = await getUserAuth();
  const { id: gastoId } = gastoIdSchema.parse({ id });
  try {
    const g = await db.gasto.delete({ where: { id: gastoId, pagadorId: session?.user.id } });
    return { gasto: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
