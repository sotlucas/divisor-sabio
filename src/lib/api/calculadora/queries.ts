import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { Evento, type EventoId, eventoIdSchema } from "@/lib/db/schema/eventos";

export interface Balance {
  nombre: string;
  balance: number;
}

export const getBalancesByEvento = async (id: EventoId): Promise<{ balances: Balance[] }> => {
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
            }
          }
        }
      },
      participantes: {
        select: {
          id: true,
          name: true,
        }
      }
    },
  });

  // iterate over gastosTotales and deudasTotales to calculate the balance of each participant
  // gastos sum to the balance, deudas subtract from the balance
  const balances: { userId: string; balance: number }[] = []

  evento?.gastos.forEach(gasto => {
    const { pagadorId, monto } = gasto;
    const balance = balances.find(b => b.userId === pagadorId);
    if (balance) {
      balance.balance += monto;
    } else {
      balances.push({ userId: pagadorId, balance: monto });
    }
  });

  evento?.gastos.forEach(gasto => {
    gasto.deudas.forEach(deuda => {
      const { deudorId, monto } = deuda;
      const balance = balances.find(b => b.userId === deudorId);
      if (balance) {
        balance.balance -= monto;
      } else {
        balances.push({ userId: deudorId, balance: -monto });
      }
    });
  });

  // Add user names to the balances and if the user is not in the balances, add it with a balance of 0
  const balancesWithNames = balances.map(balance => {
    const user = evento?.participantes.find(p => p.id === balance.userId);
    return {
      nombre: user?.name || "",
      balance: balance.balance,
    };
  });

  return { balances: balancesWithNames };
};
