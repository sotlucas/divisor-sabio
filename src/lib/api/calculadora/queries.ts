import { db } from "@/lib/db/index";
import { type EventoId, eventoIdSchema } from "@/lib/db/schema/eventos";

export interface Balance {
  id: string;
  nombre: string;
  balance: number;
}

export interface GastoTotal {
  nombre: string;
  total: number;
}

export const getBalancesByEvento = async (
  id: EventoId
): Promise<{ balances: Balance[] }> => {
  const { id: eventoId } = eventoIdSchema.parse({ id });
  const evento = await db.evento.findFirst({
    where: {
      id: eventoId,
    },
    include: {
      gastos: {
        include: {
          deudas: {
            select: {
              deudorId: true,
              monto: true,
            },
          },
        },
      },
      participantes: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // iterate over gastosTotales and deudasTotales to calculate the balance of each participant
  // gastos sum to the balance, deudas subtract from the balance
  const balances: { userId: string; balance: number }[] = [];

  evento?.gastos.forEach((gasto) => {
    const { pagadorId, monto } = gasto;
    const balance = balances.find((b) => b.userId === pagadorId);
    if (balance) {
      balance.balance += monto;
    } else {
      balances.push({ userId: pagadorId, balance: monto });
    }
  });

  evento?.gastos.forEach((gasto) => {
    gasto.deudas.forEach((deuda) => {
      const { deudorId, monto } = deuda;
      const balance = balances.find((b) => b.userId === deudorId);
      if (balance) {
        balance.balance -= monto;
      } else {
        balances.push({ userId: deudorId, balance: -monto });
      }
    });
  });

  // Add user names to the balances and if the user is not in the balances, add it with a balance of 0
  const balancesWithNames = evento?.participantes.map((participante) => {
    const balance = balances.find((b) => b.userId === participante.id);
    return {
      id: participante.id,
      nombre: participante.name,
      balance: balance ? balance.balance : 0,
    } as Balance;
  });

  return { balances: balancesWithNames ?? [] };
};

export const getGastosWithoutPayedDebtsByEvento = async (
  id: EventoId
): Promise<{ gastos: GastoTotal[] }> => {
  const { id: eventoId } = eventoIdSchema.parse({ id });
  const evento = await db.evento.findFirst({
    where: {
      id: eventoId,
    },
    include: {
      gastos: {
        where: {
          esDeudaPagada: false,
        },
        select: {
          pagadorId: true,
          monto: true,
        },
      },
      participantes: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const gastosTotales: { userId: string; total: number }[] = [];

  evento?.gastos.forEach((gasto) => {
    const { pagadorId, monto } = gasto;
    const total = gastosTotales.find((b) => b.userId === pagadorId);
    if (total) {
      total.total += monto;
    } else {
      gastosTotales.push({ userId: pagadorId, total: monto });
    }
  });

  const gastosTotalesWithNames = evento?.participantes.map((participante) => {
    const total = gastosTotales.find((b) => b.userId === participante.id);

    return {
      nombre: participante.name,
      total: total ? total.total : 0,
    } as GastoTotal;
  });

  return { gastos: gastosTotalesWithNames ?? [] };
};
