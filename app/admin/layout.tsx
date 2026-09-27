import Link from "next/link";
import { requireRole } from "@/lib/auth/guard";
import { logoutAction } from "@/lib/auth/actions";

const NAV = [
  { href: "/admin",              label: "Overview" },
  { href: "/admin/users",        label: "Users" },
  { href: "/admin/professionals",label: "Professionals" },
  { href: "/admin/verification", label: "Verification" },
  { href: "/admin/categories",   label: "Categories" },
  { href: "/admin/services",     label: "Services" },
  { href: "/admin/jobs",         label: "Jobs" },
  { href: "/admin/reviews",      label: "Reviews" },
  { href: "/admin/reports",      label: "Reports" }
];

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("ADMIN");

  return (
    <div className="min-h-screen bg-bg md:flex">
      <aside className="md:w-56 bg-white border-b md:border-b-0 md:border-r border-gray-100 p-4">
        <div className="font-bold text-primary text-lg mb-6">Solvify · Admin</div>

        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-sm text-ink hover:bg-primary/5 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAction} className="mt-6 hidden md:block">
          <p className="text-xs text-ink/60 mb-2">{user.email}</p>
          <button className="text-sm text-primary hover:underline">Sign out</button>
        </form>
      </aside>

      <main className="flex-1 p-4 md:p-8 max-w-5xl">{children}</main>
    </div>
  );
}