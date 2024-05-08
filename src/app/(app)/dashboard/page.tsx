import SignOutBtn from "@/components/auth/SignOutBtn";
import { getUserAuth } from "@/lib/auth/utils";

export default async function Home() {
  const { session } = await getUserAuth();
  return (
    <main className="">
      <h1 className="text-2xl font-bold my-2">Perfil</h1>
      <div className="my-2">
        <span className="font-bold">Email: </span>
        <span>{session?.user.email}</span>
      </div>
      <SignOutBtn />
    </main>
  );
}
