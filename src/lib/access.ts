const OWNER_CLERK_ID = process.env.OWNER_CLERK_ID;

/**
 * This is a portfolio/demo deployment: generation and billing are
 * intentionally limited to the app owner so real users can't rack up
 * OpenAI/Stability API costs on the owner's keys. Set OWNER_ONLY_MODE=false
 * in the environment to open the product up to all authenticated users.
 */
export const OWNER_ONLY_MODE = process.env.OWNER_ONLY_MODE !== "false";

export function canAccessOwnerGatedFeature(userId: string): boolean {
  return !OWNER_ONLY_MODE || userId === OWNER_CLERK_ID;
}
