import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createEvento,
  deleteEvento,
  updateEvento,
} from "@/lib/api/eventos/mutations";
import { 
  eventoIdSchema,
  insertEventoParams,
  updateEventoParams 
} from "@/lib/db/schema/eventos";

export async function POST(req: Request) {
  try {
    const validatedData = insertEventoParams.parse(await req.json());
    const { evento } = await createEvento(validatedData);

    revalidatePath("/eventos"); // optional - assumes you will have named route same as entity

    return NextResponse.json(evento, { status: 201 });
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

    const validatedData = updateEventoParams.parse(await req.json());
    const validatedParams = eventoIdSchema.parse({ id });

    const { evento } = await updateEvento(validatedParams.id, validatedData);

    return NextResponse.json(evento, { status: 200 });
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

    const validatedParams = eventoIdSchema.parse({ id });
    const { evento } = await deleteEvento(validatedParams.id);

    return NextResponse.json(evento, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
