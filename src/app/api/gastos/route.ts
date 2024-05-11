import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createGasto,
  deleteGasto,
  updateGasto,
} from "@/lib/api/gastos/mutations";
import { 
  gastoIdSchema,
  insertGastoParams,
  updateGastoParams 
} from "@/lib/db/schema/gastos";

export async function POST(req: Request) {
  try {
    const validatedData = insertGastoParams.parse(await req.json());
    const { gasto } = await createGasto(validatedData);

    revalidatePath("/gastos"); // optional - assumes you will have named route same as entity

    return NextResponse.json(gasto, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateGastoParams.parse(await req.json());
    const validatedParams = gastoIdSchema.parse({ id });

    const { gasto } = await updateGasto(validatedParams.id, validatedData);

    return NextResponse.json(gasto, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = gastoIdSchema.parse({ id });
    const { gasto } = await deleteGasto(validatedParams.id);

    return NextResponse.json(gasto, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
