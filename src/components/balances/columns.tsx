export const columns = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }: any) => {
      const color = row.original.balance < 0 ? "text-red-500" : "text-green-500";
      return <span className={color}>$ {row.original.balance.toFixed(2)}</span>;
    },
  },
];
