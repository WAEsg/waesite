import { buttonPrimaryDark, neumorphicInset } from "@/components/ui/glass";

// Dark-theme counterparts to form-field.tsx, used only by the (auth)
// login/signup pages so onboarding (still light-themed) is unaffected.
export function FormFieldDark({
  label,
  name,
  type = "text",
  required = true,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-frost">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={`mt-1 w-full min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-base font-normal text-frost outline-none transition focus:border-passport-sky focus:ring-2 focus:ring-passport-sky/40 ${neumorphicInset}`}
      />
    </label>
  );
}

export function SubmitButtonDark({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full disabled:opacity-60 ${buttonPrimaryDark}`}
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function FormErrorDark({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-xl border border-error/30 bg-error/10 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-error">
      {message}
    </p>
  );
}
