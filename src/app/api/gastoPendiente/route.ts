import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createGastoPendiente,
  deleteGastoPendiente,
  updateGastoPendiente,
} from "@/lib/api/gastoPendiente/mutations";
import { 
  gastoPendienteIdSchema,
  insertGastoPendienteParams,
  updateGastoPendienteParams 
} from "@/lib/db/schema/gastoPendiente";

export async function POST(req: Request) {
  try {
    const validatedData = insertGastoPendienteParams.parse(await req.json());
    const { gastoPendiente } = await createGastoPendiente(validatedData);

    revalidatePath("/gastoPendiente"); // optional - assumes you will have named route same as entity

    return NextResponse.json(gastoPendiente, { status: 201 });
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

    const validatedData = updateGastoPendienteParams.parse(await req.json());
    const validatedParams = gastoPendienteIdSchema.parse({ id });

    const { gastoPendiente } = await updateGastoPendiente(validatedParams.id, validatedData);

    return NextResponse.json(gastoPendiente, { status: 200 });
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

    const validatedParams = gastoPendienteIdSchema.parse({ id });
    const { gastoPendiente } = await deleteGastoPendiente(validatedParams.id);

    return NextResponse.json(gastoPendiente, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
