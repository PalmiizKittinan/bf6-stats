"use client";

import { useCSSFramework } from "@/components/CSSFrameworkProvider";
import Profile from "@/components/Profile";
import ProfileTW from "@/components/tailwind/ProfileTW";

export default function ProfilePage() {
  const { framework } = useCSSFramework();

  if (framework === "tailwind") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <ProfileTW />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Profile />
    </div>
  );
}