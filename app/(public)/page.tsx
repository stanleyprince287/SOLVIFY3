import Link from "next/link";
import { getActiveCategories } from "@/lib/categories/queries";
import { Card } from "@/components/ui/Card";

export default async function HomePage() {
  const categories = await getActiveCategories();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-bg py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-ink leading-tight">
            Find the right professional
            <br />
            for the job.
          </h1>
          <p className="text-ink/70 mt-4 max-w-xl mx-auto">
            Search, compare, and contact verified local professionals — free.
          </p>

          <form
            action="/search"
            method="get"
            className="mt-8 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto"
          >
            <input
              name="q"
              placeholder="What service do you need?"
              className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              name="location"
              placeholder="Where?"
              className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button className="rounded-lg bg-primary text-white px-5 py-3 text-sm font-medium">
              Find professionals
            </button>
          </form>
        </div>
      </section>

      {/* Popular services */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold mb-4">Popular categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.slice(0, 10).map((c) => (
            <Link key={c.id} href={`/search?category=${c.slug}`}>
              <Card className="text-center hover:border-primary transition">
                <p className="text-2xl mb-1">{c.icon ?? "•"}</p>
                <p className="text-sm font-medium">{c.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-semibold mb-6 text-center">How it works</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { n: 1, t: "Tell us what you need", d: "Describe your problem or pick a service." },
              { n: 2, t: "Compare professionals",  d: "Filter by location, rating, price." },
              { n: 3, t: "Contact & hire",         d: "Call or WhatsApp your chosen pro." },
              { n: 4, t: "Get the job done",       d: "Track the job and leave a review." }
            ].map((step) => (
              <Card key={step.n}>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold mb-3">
                  {step.n}
                </div>
                <p className="font-medium text-sm">{step.t}</p>
                <p className="text-xs text-ink/60 mt-1">{step.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-4 gap-4 text-center">
          {[
            { icon: "✓", t: "Verified professionals" },
            { icon: "⭐", t: "Customer reviews" },
            { icon: "📁", t: "Previous work shown" },
            { icon: "📍", t: "Local professionals" }
          ].map((x) => (
            <div key={x.t}>
              <p className="text-2xl mb-1">{x.icon}</p>
              <p className="text-sm text-ink/70">{x.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Professional CTA */}
      <section className="bg-primary text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-semibold">Are you a professional?</h2>
          <p className="opacity-90 mt-2">
            Get discovered by customers looking for your services.
          </p>
          <Link
            href="/register"
            className="inline-block mt-5 rounded-lg bg-white text-primary px-5 py-2.5 text-sm font-medium"
          >
            Join Solvify
          </Link>
        </div>
      </section>
    </>
  );
}