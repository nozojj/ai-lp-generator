"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return isSignedIn ? (
    <UserButton />
  ) : (
    <SignInButton mode="modal">
      <button className="rounded-lg bg-white px-4 py-2 text-black">
        Sign in
      </button>
    </SignInButton>
  );
}
