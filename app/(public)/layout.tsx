import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/guard";

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-primary text-lg">Solvify</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/categories" className="text-ink/70 hover:text-ink">Categories</Link>
            <Link href="/how-it-works" className="hidden sm:inline text-ink/70 hover:text-ink">How it works</Link>
            {user ? (
              <Link
                href={user.role === "ADMIN" ? "/admin" : user.role === "PROFESSIONAL" ? "/professional/dashboard" : "/dashboard"}
                className="rounded-lg bg-primary text-white px-3 py-1.5"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-ink/70 hover:text-ink">Sign in</Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary text-white px-3 py-1.5"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-ink/60 flex flex-wrap gap-4 justify-between">
          <p>© {new Date().getFullYear()} Solvify</p>
          <div className="flex gap-4">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/categories">Categories</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}