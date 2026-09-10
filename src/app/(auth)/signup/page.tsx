"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signUp, type AuthActionState } from "../actions";
import { FormFieldDark, FormErrorDark, SubmitButtonDark } from "@/components/ui/form-field-dark";

const initialState: AuthActionState = { error: null };

function IntendedRoleField() {
  const searchParams = useSearchParams();
  const intendedRole = searchParams.get("role");

  if (intendedRole !== "hirer" && intendedRole !== "talent") return null;
  return <input type="hidden" name="role" value={intendedRole} />;
}

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <>
      <h1 className="text-center text-2xl font-bold text-frost">
        Create your account
      </h1>
      <p className="mt-1 text-center text-sm text-mist">
        Takes about a minute — you&apos;ll pick hirer or talent next.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <Suspense fallback={null}>
          <IntendedRoleField />
        </Suspense>
        <FormFieldDark label="Email" name="email" type="email" autoComplete="email" />
        <FormFieldDark
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
        />
        <FormErrorDark message={state.error} />
        <SubmitButtonDark pending={pending}>Create account</SubmitButtonDark>
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-passport-sky hover:text-frost">
          Log in
        </Link>
      </p>
    </>
  );
}
