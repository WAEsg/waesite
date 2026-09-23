export function FormField({
  label,
  name,
  type = "text",
  required = true,
  autoComplete,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-ink-navy">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="mt-1 min-h-[50px] w-full rounded-[10px] border-[1.5px] border-field-line bg-white px-4 py-3 text-base font-normal text-ink-navy outline-none transition hover:border-voyage-blue focus:border-voyage-blue focus:ring-4 focus:ring-passport-sky/[0.22]"
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
      className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border-[1.5px] border-voyage-blue bg-voyage-blue px-[22px] py-3 font-extrabold text-white shadow-[0_6px_18px_rgba(30,79,163,0.26)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-voyage-blue-700 hover:bg-voyage-blue-700 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg bg-error-bg px-4 py-3 text-sm font-bold text-error">
      {message}
    </p>
  );
}
