import {db} from "@/lib/db/index";
import {
  GastoId,
  NewGastoParams,
  UpdateGastoParams,
  updateGastoSchema,
  insertGastoSchema,
  gastoIdSchema,
} from "@/lib/db/schema/gastos";
import {AuthSession,getUserAuth} from "@/lib/auth/utils";
import { sendEmail } from "@/lib/mail";

export const createGasto = async (gasto: NewGastoParams) => {
  const newGasto = insertGastoSchema.parse(gasto);

  const deudas = gasto?.deudoresIds.map((deudorId) => ({
    deudor: {connect: {id: deudorId}},
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
      include: {
        pagador: {
          select: { name: true },
        },
      },
    });

    const evento = await db.evento.findFirst({
      where: { id: g.eventoId },
      include: { participantes: true },
    });
    const emails = evento?.participantes.map((p) => p.email) || [];
    sendEmail({
      bcc: emails,
      subject: `Nuevo gasto en ${evento?.nombre}`,
      html: `${g.pagador.name} creó el gasto ${g.nombre} en el evento ${evento?.nombre} por un monto de $${g.monto}.`,
    });
    return { gasto: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateGasto = async (id: GastoId, updatedGastoData: UpdateGastoParams) => {
  const { session } = await getUserAuth();
  const {id: gastoToUpdateId} = gastoIdSchema.parse({id});
  const existingGasto = await db.gasto.findFirst({
    where: {id: gastoToUpdateId},
    include: {deudas: true},
  });

  await validateAction(gastoToUpdateId, session);

  const updatedGasto = updateGastoSchema.parse(updatedGastoData);
  const updatedDeudoresIds = updatedGastoData?.deudoresIds;

  const deudasToDelete = existingGasto?.deudas.filter(
    (existingDeuda) => !updatedDeudoresIds?.includes(existingDeuda.deudorId)
  );

  const deudasToModify = existingGasto?.deudas.filter(
    (deuda) => updatedDeudoresIds?.includes(deuda.deudorId)
  );

  const deudoresIdsForDeudasToCreate = updatedDeudoresIds?.filter(
    (updatedDeudorId) =>
      !existingGasto?.deudas.map((deuda) => deuda.deudorId).includes(updatedDeudorId)
  );

  try {
    const g = await db.gasto.update({
      where: {id: gastoToUpdateId},
      data: {
        ...updatedGasto,
        deudas: {
          // Crear deudas nuevas
          create: deudoresIdsForDeudasToCreate?.map((deudorId) => ({
            deudor: {connect: {id: deudorId}},
            monto: updatedGasto.monto / deudoresIdsForDeudasToCreate?.length,
          })),
          // Actualizar monto de deudas que ya existen
          updateMany: deudasToModify?.map((deuda) => ({
            where: {id: deuda.id},
            data: {monto: updatedGasto.monto / deudasToModify?.length},
          })),
          // Eliminar deudas que ya no existen
          deleteMany: deudasToDelete?.map((deuda) => ({id: deuda.id})),
        },
      },
    });
    return {gasto: g};
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw {error: message};
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
