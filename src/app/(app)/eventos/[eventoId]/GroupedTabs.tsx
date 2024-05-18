"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

export function GroupedTabs({ eventoId }: { eventoId: string }) {
  const pathname = usePathname();
  const value = pathname.split("/").pop();
  const router = useRouter();

  return (
    <Tabs
      value={value}
      onValueChange={(value) => {
        router.push(`/eventos/${eventoId}/${value}`);
      }}
    >
      <TabsList>
        <TabsTrigger value="gastos">Gastos</TabsTrigger>
        <TabsTrigger value="deudas">Deudas</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
