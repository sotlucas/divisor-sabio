"use client";

import { DonutChart, Legend } from "@tremor/react";
import { GastoTotal } from "@/lib/api/calculadora/queries";

interface Props {
  gastosTotales: GastoTotal[];
}

const dataFormatter = (number: number) => `$ ${number.toFixed(2)}`;

const GastosTotales = ({ gastosTotales }: Props) => {
  const data = gastosTotales.map((gasto) => ({
    name: gasto.nombre,
    value: gasto.total,
  }));

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <DonutChart data={data} valueFormatter={dataFormatter} />
      <Legend categories={data.map((d) => d.name)} className="max-w-xs" />
    </div>
  );
};

export default GastosTotales;
