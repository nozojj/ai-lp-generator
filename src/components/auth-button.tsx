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
    <div className="flex items-center gap-2 sm:gap-3">
      <SignInButton mode="modal">
        <button className="rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap text-zinc-300 hover:text-white sm:px-4 sm:py-2 sm:text-sm">
          Sign in
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="rounded-lg bg-card px-2.5 py-1.5 text-xs whitespace-nowrap text-black sm:px-4 sm:py-2 sm:text-sm">
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
}
