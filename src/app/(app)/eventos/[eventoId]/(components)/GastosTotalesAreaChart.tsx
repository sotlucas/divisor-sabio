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
  // Sumar los gastos totales de cada día
  let suma = 0;
  const data = gastosATravesDelTiempo.map((gasto) => ({
    GastosTotales: suma += gasto.total,
    date: convertDate(gasto.fecha),
  }));

  return (
    <div className="">
      <AreaChart data={data} categories={['GastosTotales']} index="date" valueFormatter={dataFormatter} yAxisWidth={80} />
    </div>
  );
};

export default GastosTotalesAreaChart;
