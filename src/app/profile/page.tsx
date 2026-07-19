"use client";

import { useSearch } from "@/components/SearchProvider";
import Profile from "@/components/Profile";

export default function ProfilePage() {
  const { playerName, platform } = useSearch();

  return (
    <div className="container py-4">
      <Profile playerName={playerName} platform={platform} />
    </div>
  );
}