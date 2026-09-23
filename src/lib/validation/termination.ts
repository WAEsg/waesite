import { z } from "zod";

export const initiateTerminationSchema = z.object({
  contract_id: z.string().uuid(),
  cause: z.enum(
    ["talent_mia", "talent_quit", "client_no_cause", "performance", "mutual", "other"],
    { error: "Choose a reason for termination." }
  ),
  notes: z.string().trim().optional(),
});

export const settleTerminationSchema = z.object({
  termination_id: z.string().uuid(),
  settlement_type: z.enum(["cash_refund", "credit"], {
    error: "Choose a settlement option.",
  }),
});
