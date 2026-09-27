import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata = { title: "Login — Solvify" };

export default function LoginPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}
