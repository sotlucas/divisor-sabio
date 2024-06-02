"use client";

import { Balance } from "@/lib/api/calculadora/queries";
import { Card, DeltaBar } from "@tremor/react";

interface Props {
  balances: Balance[];
}

const Balances = ({ balances }: Props) => {
  const data = balances
    .sort((a: Balance, b: Balance) => a.balance - b.balance)
    .reverse()
    .map((balance: Balance) => ({
      name: balance.nombre,
      value: Number(balance.balance.toFixed(2)),
      color: balance.balance < 0 ? "red" : "green",
    }));

  return (
    <>
      {data.map((balance: any) => (
        <div key={balance.name} className="mt-4 first:mt-0">
          <p className="text-tremor-default flex items-center justify-between">
            <span>{balance.name}</span>
            <span className="flex items-center space-x-1">
              <span>$ {balance.value}</span>
            </span>
          </p>
          <DeltaBar value={balance.value} className="mt-3" color="black" />
        </div>
      ))}
    </>
  );
};

export default Balances;
