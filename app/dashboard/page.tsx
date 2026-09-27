
import { requireUser } from "@/lib/auth/guard";
import { logoutAction } from "@/lib/auth/actions";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold">Welcome, {user.full_name}</h1>
      <p className="text-sm text-ink/70 mt-1">Role: {user.role}</p>

      <form action={logoutAction} className="mt-6">
        <button className="text-sm text-primary hover:underline">Sign out</button>
      </form>
    </div>
  );
}
