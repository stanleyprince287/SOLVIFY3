import Link from "next/link";
import { getAllCategories } from "@/lib/categories/queries";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-ink/60">{categories.length} total</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>+ New category</Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <Card>
          <p className="text-sm text-ink/60">No categories yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {categories.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{c.icon ?? "•"}</span>
                  <p className="font-medium truncate">{c.name}</p>
                  {!c.is_active && <Badge variant="warning">Inactive</Badge>}
                </div>
                <p className="text-xs text-ink/60 mt-0.5 truncate">
                  /{c.slug} · {c.description || "No description"}
                </p>
              </div>
              <Link href={`/admin/categories/${c.id}`}>
                <Button variant="secondary">Edit</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}