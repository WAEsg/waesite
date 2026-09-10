"use client";

import Link from "next/link";
import { useActionState } from "react";
import { logIn, type AuthActionState } from "../actions";
import { FormFieldDark, FormErrorDark, SubmitButtonDark } from "@/components/ui/form-field-dark";

const initialState: AuthActionState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(logIn, initialState);

  return (
    <>
      <h1 className="text-center text-2xl font-bold text-frost">
        Welcome back
      </h1>
      <p className="mt-1 text-center text-sm text-mist">
        Log in to your WaeWork account.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <FormFieldDark label="Email" name="email" type="email" autoComplete="email" />
        <FormFieldDark
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
        <FormErrorDark message={state.error} />
        <SubmitButtonDark pending={pending}>Log in</SubmitButtonDark>
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        New to WaeWork?{" "}
        <Link href="/signup" className="font-semibold text-passport-sky hover:text-frost">
          Create an account
        </Link>
      </p>
    </>
  );
}
