import Link from "next/link";
import { getAllCategories } from "@/lib/categories/queries";
import { getAllServices } from "@/lib/services/queries";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function AdminServicesPage() {
  const [categories, services] = await Promise.all([
    getAllCategories(),
    getAllServices()
  ]);

  const byCategory = new Map<string, typeof services>();
  for (const s of services) {
    const list = byCategory.get(s.category_id) ?? [];
    list.push(s);
    byCategory.set(s.category_id, list);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-ink/60">{services.length} total</p>
        </div>
        <Link href="/admin/services/new">
          <Button>+ New service</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {categories.map((c) => {
          const list = byCategory.get(c.id) ?? [];
          return (
            <section key={c.id}>
              <h2 className="text-sm font-semibold text-ink/70 mb-2">
                {c.icon ?? "•"} {c.name} · {list.length}
              </h2>
              {list.length === 0 ? (
                <Card>
                  <p className="text-xs text-ink/50">No services yet.</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {list.map((s) => (
                    <Card key={s.id} className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{s.name}</p>
                          {!s.is_active && <Badge variant="warning">Inactive</Badge>}
                        </div>
                        <p className="text-xs text-ink/60 mt-0.5 truncate">/{s.slug}</p>
                      </div>
                      <Link href={`/admin/services/${s.id}`}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}