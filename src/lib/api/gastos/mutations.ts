import { db } from "@/lib/db/index";
import {
  GastoId,
  NewGastoParams,
  UpdateGastoParams,
  updateGastoSchema,
  insertGastoSchema,
  gastoIdSchema,
} from "@/lib/db/schema/gastos";
import { AuthSession, getUserAuth } from "@/lib/auth/utils";

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

  await validateAction(gastoId, session);

  const gastoWithDeudas = await db.gasto.findFirst({
    where: { id: gastoId },
    include: { deudas: true },
  });

  try {
    const g = await db.gasto.update({
      where: { id: gastoId },
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

  await validateAction(gastoId, session);

  try {
    const g = await db.gasto.delete({
      where: { id: gastoId },
    });
    return { gasto: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

// Only the owner of the event or the owner of the gasto can delete it
const validateAction = async (
  gastoId: string,
  session: AuthSession["session"]
) => {
  const evento = await db.evento.findFirst({
    where: { gastos: { some: { id: gastoId } } },
    select: { userId: true },
  });

  const gasto = await db.gasto.findFirst({
    where: { id: gastoId },
    select: { pagadorId: true },
  });

  if (
    session?.user.id !== evento?.userId &&
    session?.user.id !== gasto?.pagadorId
  ) {
    throw { error: "You don't have permission to perform this action" };
  }
};
