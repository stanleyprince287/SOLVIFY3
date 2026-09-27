import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHome() {
  const supabase = await createClient();

  const [users, professionals, pending, activeJobs] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("professionals").select("id", { count: "exact", head: true }),
    supabase.from("professionals").select("id", { count: "exact", head: true }).eq("verification_status", "PENDING"),
    supabase.from("jobs").select("id", { count: "exact", head: true }).in("status", ["REQUESTED", "ACCEPTED", "IN_PROGRESS"])
  ]);

  const stats = [
    { label: "Total users",         value: users.count ?? 0,          href: "/admin/users" },
    { label: "Professionals",       value: professionals.count ?? 0,  href: "/admin/professionals" },
    { label: "Pending verification",value: pending.count ?? 0,        href: "/admin/verification" },
    { label: "Active jobs",         value: activeJobs.count ?? 0,     href: "/admin/jobs" }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:border-primary transition">
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-ink/70 mt-1">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}