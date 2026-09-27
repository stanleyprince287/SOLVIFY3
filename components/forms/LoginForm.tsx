"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState(loginAction, undefined);
  const params = useSearchParams();
  const next = params.get("next") ?? "";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-ink/70 mb-5">Sign in to your Solvify account.</p>

      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Input label="Password" name="password" type="password" required autoComplete="current-password" />

        {state?.error && (
          <p className="text-sm text-danger bg-danger/10 rounded-md px-3 py-2">{state.error}</p>
        )}

        <SubmitButton />
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Forgot password?
        </Link>
        <Link href="/register" className="text-primary hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}