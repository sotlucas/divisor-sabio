import { db } from "@/lib/db/index";
import {
  GastoId,
  gastoIdSchema,
  insertGastoSchema,
  NewGastoParams,
  UpdateGastoParams,
  updateGastoSchema,
} from "@/lib/db/schema/gastos";
import { AuthSession, getUserAuth } from "@/lib/auth/utils";
import { sendEmail } from "@/lib/mail";

export const createGasto = async (newGastoData: NewGastoParams) => {
  const newGasto = insertGastoSchema.parse(newGastoData);

  const deudas = newGastoData?.deudoresIds.map((deudorId) => ({
    deudor: { connect: { id: deudorId } },
    monto: newGasto.monto / newGastoData?.deudoresIds.length,
  }));

  try {
    const gasto = await db.gasto.create({
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
      where: { id: gasto.eventoId },
      include: { participantes: true },
    });

    await notifyAllEventParticipants(evento, gasto);

    return { gasto: gasto };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateGasto = async (
  id: GastoId,
  updatedGastoData: UpdateGastoParams
) => {
  const { session } = await getUserAuth();
  const { id: gastoToUpdateId } = gastoIdSchema.parse({ id });
  const existingGasto = await db.gasto.findFirst({
    where: { id: gastoToUpdateId },
    include: { deudas: true },
  });

  await validateAction(gastoToUpdateId, session);

  const updatedGasto = updateGastoSchema.parse(updatedGastoData);
  const updatedDeudoresIds = updatedGastoData?.deudoresIds;

  const deudasToDelete = existingGasto?.deudas.filter(
    (existingDeuda) => !updatedDeudoresIds?.includes(existingDeuda.deudorId)
  );

  const deudasToModify = existingGasto?.deudas.filter((deuda) =>
    updatedDeudoresIds?.includes(deuda.deudorId)
  );

  const deudoresIdsForDeudasToCreate = updatedDeudoresIds?.filter(
    (updatedDeudorId) =>
      !existingGasto?.deudas
        .map((deuda) => deuda.deudorId)
        .includes(updatedDeudorId)
  );

  try {
    const g = await db.gasto.update({
      where: { id: gastoToUpdateId },
      data: {
        ...updatedGasto,
        deudas: {
          // Crear deudas nuevas
          create: deudoresIdsForDeudasToCreate?.map((deudorId) => ({
            deudor: { connect: { id: deudorId } },
            monto: updatedGasto.monto / deudoresIdsForDeudasToCreate?.length,
          })),
          // Actualizar monto de deudas que ya existen
          updateMany: deudasToModify?.map((deuda) => ({
            where: { id: deuda.id },
            data: { monto: updatedGasto.monto / deudasToModify?.length },
          })),
          // Eliminar deudas que ya no existen
          deleteMany: deudasToDelete?.map((deuda) => ({ id: deuda.id })),
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

async function notifyAllEventParticipants(evento: any, gasto: any) {
  let subject;
  let message;
  if (gasto.esDeudaPagada) {
    message = `${gasto.pagador.name} pagó una deuda por un monto de $${gasto.monto} en el evento ${evento?.nombre}.`;
    subject = `Deuda pagada en ${evento?.nombre}`;
  } else {
    message = `${gasto.pagador.name} creó el gasto ${gasto.nombre} en el evento ${evento?.nombre} por un monto de $${gasto.monto}.`;
    subject = `Nuevo gasto en ${evento?.nombre}`;
  }

  const participantsNotificationsEnabled = evento?.participantes?.filter(
    (p: any) => p.recibirNotificaciones
  );

  const allParticipantsEmails =
    participantsNotificationsEnabled?.map((p: any) => p.email) || [];
  if (participantsNotificationsEnabled.length > 0) {
    sendEmail({
      bcc: allParticipantsEmails,
      subject: `Nuevo gasto en ${evento?.nombre}`,
      html: gastoCreationMessage,
    });
  }

  for (const participant of participantsNotificationsEnabled) {
    await db.notification.create({
      data: {
        userId: participant.id,
        message,
        read: false,
        eventoId: evento.id,
      },
    });
  }
}
