import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <main>
      <div className="flex h-screen">
        <main className="flex flex-1 md:p-8 pt-2 p-8 overflow-y-auto items-center justify-center">
          {children}
        </main>
      </div>
      <Toaster richColors />
    </main>
  );
}
