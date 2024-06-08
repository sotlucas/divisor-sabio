"use server";

import {revalidatePath} from "next/cache";
import {createGasto, deleteGasto, updateGasto,} from "@/lib/api/gastos/mutations";
import {
  GastoId,
  gastoIdSchema,
  insertGastoParams,
  NewGastoParams,
  UpdateGastoParams,
  updateGastoParams,
} from "@/lib/db/schema/gastos";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateGastos = () => revalidatePath("/gastos");

export const createGastoAction = async (input: NewGastoParams) => {
  try {
    const payload = insertGastoParams.parse(input);
    await createGasto(payload);
    revalidateGastos();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateGastoAction = async (input: UpdateGastoParams) => {
  try {
    const payload = updateGastoParams.parse(input);
    await updateGasto(payload.id, payload);
    revalidateGastos();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteGastoAction = async (input: GastoId) => {
  try {
    const payload = gastoIdSchema.parse({id: input});
    await deleteGasto(payload.id);
    revalidateGastos();
  } catch (e) {
    return handleErrors(e);
  }
};