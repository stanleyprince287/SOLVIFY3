export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <a href="/" className="text-2xl font-bold text-primary">Solvify</a>
        </div>
        {children}
      </div>
    </div>
  );
}