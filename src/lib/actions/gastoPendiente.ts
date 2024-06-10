"use server";

import { revalidatePath } from "next/cache";
import {
  createGastoPendiente,
  deleteGastoPendiente,
  updateGastoPendiente,
} from "@/lib/api/gastoPendiente/mutations";
import {
  GastoPendienteId,
  NewGastoPendienteParams,
  UpdateGastoPendienteParams,
  gastoPendienteIdSchema,
  insertGastoPendienteParams,
  updateGastoPendienteParams,
} from "@/lib/db/schema/gastoPendiente";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateGastoPendientes = () => revalidatePath("/gasto-pendiente");

export const createGastoPendienteAction = async (
  input: NewGastoPendienteParams
) => {
  try {
    const payload = insertGastoPendienteParams.parse(input);
    await createGastoPendiente(payload);
    revalidateGastoPendientes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateGastoPendienteAction = async (
  input: UpdateGastoPendienteParams
) => {
  try {
    const payload = updateGastoPendienteParams.parse(input);
    await updateGastoPendiente(payload.id, payload);
    revalidateGastoPendientes();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteGastoPendienteAction = async (input: GastoPendienteId) => {
  try {
    const payload = gastoPendienteIdSchema.parse({ id: input });
    await deleteGastoPendiente(payload.id);
    revalidateGastoPendientes();
  } catch (e) {
    return handleErrors(e);
  }
};
