"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return isSignedIn ? (
    <UserButton />
  ) : (
    <div className="flex items-center gap-3">
      <SignInButton mode="modal">
        <button className="rounded-lg px-4 py-2 text-sm text-zinc-300 hover:text-white">
          Sign in
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="rounded-lg bg-card px-4 py-2 text-sm text-black">
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
}
