import { redirect } from "next/navigation";

export default async function EventoPage({
  params: { eventoId },
}: {
  params: { eventoId: string };
}) {
  redirect(`/eventos/${eventoId}/gastos`);
}
