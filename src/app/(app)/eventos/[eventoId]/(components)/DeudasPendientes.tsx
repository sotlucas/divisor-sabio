"use client";

import { ProgressCircle } from "@tremor/react";

interface Props {
  gastoTotal: number;
  deudaTotal: number;
}

const DeudasPendientes = ({ gastoTotal, deudaTotal }: Props) => {

  const porcentajePagado = ((gastoTotal - deudaTotal) / gastoTotal) * 100 || 100;

  let color = "green";
  if (porcentajePagado < 30) {
    color = "red";
  } else if (porcentajePagado < 70) {
    color = "yellow";
  }

  return (
    <div className="flex flex-col space-y-5 items-center">
      <ProgressCircle value={porcentajePagado} size="xl" color={color}>
        <span>{porcentajePagado.toFixed(2)}%</span>
      </ProgressCircle>
      <div>
        <p className="text-tremor-default font-medium">
          $ {(gastoTotal - deudaTotal).toFixed(2)} / $ {gastoTotal.toFixed(2)} (
          {porcentajePagado.toFixed(2)}%)
        </p>
      </div>
    </div>
  );
};

export default DeudasPendientes;
