export function FormField({
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
    <label className="block text-sm font-semibold text-ink-navy">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-1 w-full rounded-xl border border-ink-navy/15 bg-paper-white px-4 py-2.5 text-base font-normal text-ink-navy outline-none transition focus:border-voyage-blue focus:ring-2 focus:ring-passport-sky/40"
      />
    </label>
  );
}

export function SubmitButton({
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
      className="w-full rounded-xl bg-voyage-blue px-4 py-2.5 font-semibold text-paper-white transition hover:bg-voyage-blue/90 disabled:opacity-60"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-xl bg-error/10 px-4 py-2.5 text-sm font-medium text-error">
      {message}
    </p>
  );
}
