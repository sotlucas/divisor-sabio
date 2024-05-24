import SignOutBtn from "@/components/auth/SignOutBtn";
import UserSettings from "./UserSettings";
import { checkAuth, getUserAuth } from "@/lib/auth/utils";

export default async function Account() {
  await checkAuth();
  const { session } = await getUserAuth();

  return (
    <main>
      <h1 className="text-2xl font-semibold my-4">Perfil</h1>
      <div className="space-y-4">
        <UserSettings session={session} />
      </div>
      <div className="mt-8">
        <SignOutBtn />
      </div>
    </main>
  );
}
