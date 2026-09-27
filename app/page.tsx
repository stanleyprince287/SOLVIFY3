import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold text-primary mb-3">
          Find the right professional for the job.
        </h1>
        <p className="text-ink/70 mb-6">
          Solvify is coming together. Auth is live.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/register"
            className="rounded-lg bg-primary text-white px-4 py-2 text-sm"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}