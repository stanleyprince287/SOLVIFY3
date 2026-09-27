import Link from "next/link";
import { getActiveCategories } from "@/lib/categories/queries";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Search — Solvify" };

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; location?: string; category?: string }>;
}) {
  const params = await searchParams;
  const categories = await getActiveCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-1">Search</h1>
      <p className="text-sm text-ink/60 mb-6">
        {params.q ? `Results for "${params.q}"` : "Browse categories to get started"}
        {params.location ? ` in ${params.location}` : ""}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((c) => (
          <Link key={c.id} href={`/search?category=${c.slug}`}>
            <Card className="h-full hover:border-primary transition">
              <p className="text-2xl mb-2">{c.icon ?? "•"}</p>
              <p className="font-medium">{c.name}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <p className="text-sm text-ink/60">
          Full search results with professionals will appear here in a later update.
        </p>
      </Card>
    </div>
  );
}