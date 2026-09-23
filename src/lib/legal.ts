import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Bump the relevant version string whenever content/legal/*.md changes in
// a way that requires existing users to re-accept (see
// src/lib/validation/... terms_acceptances — a version bump means new
// rows get recorded, not that old acceptance rows are edited).
export const LEGAL_VERSIONS = {
  tos: "2026-09-21",
  privacy: "2026-09-21",
} as const;

export type LegalDocumentType = keyof typeof LEGAL_VERSIONS;

const FILE_BY_TYPE: Record<LegalDocumentType, string> = {
  tos: "terms.md",
  privacy: "privacy.md",
};

export async function readLegalDocument(type: LegalDocumentType): Promise<string> {
  const filePath = path.join(process.cwd(), "content", "legal", FILE_BY_TYPE[type]);
  return readFile(filePath, "utf-8");
}
