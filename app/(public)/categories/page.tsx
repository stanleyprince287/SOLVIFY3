import Link from "next/link";
import { getActiveCategories } from "@/lib/categories/queries";
import { getServicesByCategory } from "@/lib/services/queries";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Categories — Solvify" };

export default async function CategoriesPage() {
  const categories = await getActiveCategories();

  // For each category, count services (cheap enough for MVP)
  const servicesByCategory = await Promise.all(
    categories.map((c) => getServicesByCategory(c.id).then((s) => ({ id: c.id, count: s.length })))
  );
  const countMap = new Map(servicesByCategory.map((x) => [x.id, x.count]));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Browse categories</h1>
      <p className="text-sm text-ink/60 mb-8">
        Choose what you need help with.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((c) => (
          <Link key={c.id} href={`/search?category=${c.slug}`}>
            <Card className="h-full hover:border-primary transition">
              <p className="text-2xl mb-2">{c.icon ?? "•"}</p>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-ink/60 mt-1">
                {countMap.get(c.id) ?? 0} services
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <p className="text-sm text-ink/60">No categories yet.</p>
        </Card>
      )}
    </div>
  );
}