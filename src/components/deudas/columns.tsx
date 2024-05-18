export const columns = [
  {
    accessorKey: "deudor",
    header: "Deudor",
  },
  {
    accessorKey: "receptor",
    header: "Receptor",
  },
  {
    accessorKey: "monto",
    header: "Monto",
    cell: ({ row }: any) => {
      return `$ ${row.original.monto.toFixed(2)}`;
    },
  },
];
