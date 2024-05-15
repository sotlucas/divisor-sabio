"use client";

import { CompleteUser } from "prisma/zod/user";
import { DataTable } from "../shared/DataTable";


// TODO: Change participantes type
export default function ParticipanteList({ participantes }: {
    participantes: {
        name: string | null;
        email: string;
    }[]
}) {
    return (
        <div>
            <DataTable columns={[
                {
                    accessorKey: "name",
                    header: "Nombre",
                },
                {
                    accessorKey: "email",
                    header: "Email",
                },
            ]} data={participantes} />
        </div>
    );
}