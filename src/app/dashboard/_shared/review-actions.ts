"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ReviewActionState = { error: string | null };

// Reviews are prompted at end-of-gig (contract status completed/
// terminated) — see the review prompt in ContractDetail. The spec's
// "every 90 days for ongoing roles" recurring re-review isn't built:
// that needs a scheduled surface ("it's been 90 days, rate them again")
// which doesn't exist anywhere else in this codebase yet either — the
// one-time end-of-gig review is real and live, the recurring one is a
// follow-up.
export async function submitReview(
  _prevState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const contractId = formData.get("contract_id");
  const rateeId = formData.get("ratee_id");
  const scoreRaw = formData.get("score");
  const comment = formData.get("comment");

  if (typeof contractId !== "string" || typeof rateeId !== "string" || !scoreRaw) {
    return { error: "Invalid request." };
  }

  const score = Number(scoreRaw);
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return { error: "Choose a rating from 1 to 5." };
  }

  const { error } = await supabase.from("reviews").insert({
    contract_id: contractId,
    rater_id: user!.id,
    ratee_id: rateeId,
    score,
    comment: typeof comment === "string" && comment.trim() ? comment.trim() : null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/hirer/contracts/${contractId}`);
  revalidatePath(`/dashboard/talent/contracts/${contractId}`);
  return { error: null };
}
