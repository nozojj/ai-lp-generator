import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/common/PageHeader";
import SettingCard from "@/components/common/SettingCard";
import ThemeToggle from "@/components/theme-toggle";

export default async function SettingsPage() {
  const { userId, sessionClaims } = await auth();

  const clerkUser = await currentUser();

  if (!userId) {
    return <main className="p-8">ログインしてください</main>;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return <main className="p-8">ユーザーが存在しません</main>;
  }

  const shortUserId =
    user.clerkId.length > 16
      ? `${user.clerkId.slice(0, 10)}...${user.clerkId.slice(-5)}`
      : user.clerkId;

  const userName =
    clerkUser?.fullName || clerkUser?.firstName || "Unknown User";

  const totalGenerations = await prisma.generation.count({
    where: {
      userId: user.id,
    },
  });
  const APP_VERSION = "1.0.0";

  return (
    <main className="bg-background text-foreground min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          label="Settings"
          title="設定"
          description="アカウントやテーマを管理できます。"
        />

        <div className="space-y-6">
          <SettingCard title="Account">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span>{userName}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    user.isPro
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-zinc-500/20 text-zinc-300"
                  }`}
                >
                  {user.isPro ? "Pro" : "Free"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits</span>

                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400">
                  ⚡ {user.credits.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID</span>
                <span>{shortUserId}</span>
              </div>
            </div>
          </SettingCard>

          <SettingCard title="Appearance">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Theme</span>

              <ThemeToggle />
            </div>
          </SettingCard>

          <SettingCard title="About">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application</span>
                <span>AI LP Generator</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>{APP_VERSION}</span>
              </div>
            </div>
          </SettingCard>

          <SettingCard title="Statistics">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total LP</span>
                <span>{totalGenerations}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Plan</span>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    user.isPro
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-zinc-500/20 text-zinc-300"
                  }`}
                >
                  {user.isPro ? "Pro" : "Free"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits</span>

                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400">
                  ⚡ {user.credits.toLocaleString()}
                </span>
              </div>
            </div>
          </SettingCard>
        </div>
      </div>
    </main>
  );
}
