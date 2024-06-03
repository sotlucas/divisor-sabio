"use client";

import { AreaChart } from "@tremor/react";
import { GastoATravesDelTiempo } from "@/lib/api/calculadora/queries";

interface Props {
  gastosATravesDelTiempo: GastoATravesDelTiempo[];
}

const convertDate = (date: Date) => {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

const dataFormatter = (number: number) => `$ ${number.toFixed(2)}`;

const GastosTotalesAreaChart = ({ gastosATravesDelTiempo }: Props) => {

  // Unify the total of gastos of the same date
  const data = gastosATravesDelTiempo.reduce((acc, gasto) => {
    const date = convertDate(gasto.fecha);
    const current = acc.find((d) => d.date === date);
    if (current) {
      current.GastosTotales += gasto.total;
    } else {
      acc.push({ date, GastosTotales: gasto.total });
    }
    return acc;
  }, [] as { date: string; GastosTotales: number }[]);

  // Now sum the gastos of all previous dates to get the total gastos at each date
  let suma = 0;
  data.forEach((d, i) => {
    suma += d.GastosTotales;
    d.GastosTotales = suma;
  });

  return (
    <div className="">
      <AreaChart data={data} categories={['GastosTotales']} index="date" valueFormatter={dataFormatter} yAxisWidth={80} />
    </div>
  );
};

export default GastosTotalesAreaChart;
