// The prototype's `.progress` — three bars-with-labels, done steps in
// green, the current step in voyage-blue, everything else neutral. The
// real flow's three pages don't map 1:1 onto the prototype's (ours is
// Account -> Profile -> Verify ID, since Supabase's email-confirmation
// redirect forces a real page boundary the prototype's fake flow never
// needed), so the labels are adapted to what actually happens here.
const STEPS = ["1 · Account", "2 · Profile", "3 · Verify ID"];

export function SignupProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <ol className="flex gap-2" aria-label="Sign-up steps">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const isCurrent = n === step;
        const isDone = n < step;
        return (
          <li
            key={label}
            aria-current={isCurrent ? "step" : undefined}
            className={`flex min-w-0 flex-1 flex-col gap-2 text-[0.8125rem] font-extrabold ${
              isCurrent ? "text-voyage-blue" : isDone ? "text-ink-navy" : "text-slate"
            }`}
          >
            <span aria-hidden className={`h-[5px] rounded-full transition-colors duration-500 ${isCurrent ? "bg-voyage-blue" : isDone ? "bg-success" : "bg-line"}`} />
            <span className="leading-[1.25]">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
