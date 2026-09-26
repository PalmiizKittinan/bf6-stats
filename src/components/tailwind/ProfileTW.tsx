"use client";

import { ProfileStat, CompetitiveRank } from "@/types/bf6";
import { usePlayerStore } from "@/store/usePlayerStore";
import { StatCard, StatGrid, SectionTitle, MiniStat, EmptyState, LoadingState, RefreshingBar, ErrorState } from "./TailwindShared";

function getStat(stats: ProfileStat[], name: string): number | undefined {
  const s = stats.find((s) => s.name === name);
  return s?.value;
}

function formatNumber(n: number | undefined): string {
  if (n === undefined || n === null) return "-";
  return n.toLocaleString();
}

function formatTime(seconds: number | undefined): string {
  if (!seconds) return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function ClassCard({ name, icon, kills, deaths, revives, score, time }: { name: string; icon: string; kills?: number; deaths?: number; revives?: number; score?: number; time?: number }) {
  const kdr = kills && deaths && deaths > 0 ? (kills / deaths).toFixed(2) : "-";
  return (
    <div className="tw-glass-card tw-stat-tile tw-rise p-4 h-full">
      <div className="flex items-center gap-3 mb-4">
        <span className="tw-icon-badge">{icon}</span>
        <div>
          <div className="tw-eyebrow" style={{ fontSize: "0.6rem" }}>Class</div>
          <h6 className="font-bold text-lg mb-0 leading-tight" style={{ color: "var(--bf6-text-strong)" }}>{name}</h6>
        </div>
        <div className="ml-auto text-right">
          <div className="tw-stat-label">K/D</div>
          <div className="text-xl font-bold tabular-nums tw-gradient-text">{kdr}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <MiniStat label="Kills" value={formatNumber(kills)} />
        <MiniStat label="Deaths" value={formatNumber(deaths)} />
        <MiniStat label="Revives" value={formatNumber(revives)} />
        <MiniStat label="Score" value={formatNumber(score)} />
        <div className="col-span-2">
          <MiniStat label="Time Played" value={formatTime(time)} />
        </div>
      </div>
    </div>
  );
}

function CompRankCard({ rank }: { rank: CompetitiveRank }) {
  const isUnranked = rank.rankName === "Unranked";
  return (
    <div className={`tw-glass-card tw-stat-tile tw-rise p-4 h-full ${isUnranked ? "" : "tw-stat-tile-highlight"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="tw-stat-label mb-1">{rank.modeName}</div>
          <div className={`font-bold text-xl tracking-tight ${isUnranked ? "" : "tw-gradient-text"}`} style={{ color: isUnranked ? "var(--bf6-text-muted)" : undefined }}>
            {rank.rankName}
          </div>
        </div>
        <span className="tw-pill">{rank.type}</span>
      </div>
    </div>
  );
}

export default function ProfileTW() {
  const { playerName, profile, profileLoading, profileError, fetchProfile } = usePlayerStore();

  const handleRefresh = () => { if (playerName) fetchProfile(); };

  if (!playerName) return <EmptyState />;

  if (profileLoading && !profile) return <LoadingState message={`Loading profile for ${playerName}...`} />;

  if (profileError || !profile || !profile.playerProfiles?.length) {
    return <ErrorState title="Profile Not Found" message={profileError || "No profile data available."} />;
  }

  const p = profile.playerProfiles[0];
  const { stats, playerCard, totalDogTags, competitiveRanks, rankName } = p;

  const score = getStat(stats, "score_total");
  const kills = getStat(stats, "Kills_Total");
  const deaths = getStat(stats, "deaths_total");
  const matches = getStat(stats, "matches_level");
  const wins = getStat(stats, "wins_level");
  const losses = getStat(stats, "losses_level");
  const assists = getStat(stats, "Assist_Total");
  const damage = getStat(stats, "Dmg_Dealt_Total");
  const headshotKills = getStat(stats, "kills_Headshots_Total");
  const humanKills = getStat(stats, "human_kills_total");
  const multiKills = getStat(stats, "Kills_Multi_Total");
  const longestStreak = getStat(stats, "killstreak_longest_Total");
  const captured = getStat(stats, "Obj_Captured_Total");
  const neutralized = getStat(stats, "obj_neutralized_total");
  const objTime = getStat(stats, "Obj_Time_Total");
  const revives = getStat(stats, "Revives_Teammates_Total");
  const heals = getStat(stats, "Dmg_Healed_Total");
  const repairs = getStat(stats, "Veh_RepairedHP_Total");
  const vehDestroyed = getStat(stats, "Destroyed_Veh_Total");
  const spotted = getStat(stats, "Spotted_Enemies_Total");
  const squadRevives = getStat(stats, "Revives_Squadmates_Total");
  const throwables = getStat(stats, "thrown_throwables_total");
  const shotsFired = getStat(stats, "sfw_wp_temp");
  const shotsHit = getStat(stats, "shw_wp_temp");
  const accuracy = shotsFired && shotsHit ? ((shotsHit / shotsFired) * 100).toFixed(1) + "%" : "-";
  const winPercent = matches && wins ? ((wins / matches) * 100).toFixed(1) + "%" : "-";
  const kdr = kills && deaths ? (kills / deaths).toFixed(2) : "-";

  return (
    <div>
      {/* Player Card Header */}
      <div className="tw-glass-card tw-glass-static tw-rise relative overflow-hidden mb-8" style={{ borderColor: "var(--bf6-border-hover)" }}>
        <div className="tw-mesh" />
        <div className="relative p-6 sm:p-8 flex items-center gap-6 flex-wrap">
          {playerCard.rankImage?.large && (
            <div className="tw-icon-badge shrink-0" style={{ width: 104, height: 104, borderRadius: 28 }}>
              <img src={playerCard.rankImage.large} alt={`Rank ${playerCard.rank}`} className="w-20 h-20 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
          <div className="flex-grow min-w-[220px]">
            <div className="tw-eyebrow mb-1">{rankName}</div>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: "var(--bf6-text-strong)" }}>{playerName}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="tw-pill">🏅 Badges <b style={{ color: "var(--bf6-text-strong)" }}>{playerCard.badges}</b></span>
              <span className="tw-pill">🏷️ Dog Tags <b style={{ color: "var(--bf6-text-strong)" }}>{totalDogTags?.intValue ?? "-"}</b></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="tw-ring-badge text-center px-6 py-4">
              <div className="tw-stat-label">Rank</div>
              <div className="text-4xl font-extrabold tabular-nums tw-gradient-text leading-none mt-1">{playerCard.rank}</div>
            </div>
            <button className="tw-btn tw-btn-icon" onClick={handleRefresh} title="Refresh">
              🔄
            </button>
          </div>
        </div>
      </div>

      {profileLoading && profile && <RefreshingBar />}

      {/* Competitive Ranks */}
      {competitiveRanks.length > 0 && (
        <div className="mb-8">
          <SectionTitle icon="🏅" title="Competitive Ranks" />
          <StatGrid cols="wide3">{competitiveRanks.map((cr: CompetitiveRank) => <CompRankCard key={cr.type + cr.mode} rank={cr} />)}</StatGrid>
        </div>
      )}

      {/* Profile Overview */}
      <div className="mb-8">
        <SectionTitle icon="📊" title="Profile Overview" />
        <StatGrid cols={4}>
          <StatCard icon="⭐" label="Score" value={formatNumber(score)} />
          <StatCard icon="💀" label="Kills" value={formatNumber(kills)} />
          <StatCard icon="☠️" label="Deaths" value={formatNumber(deaths)} />
          <StatCard icon="📊" label="K/D" value={kdr} highlight />
          <StatCard icon="🎮" label="Matches" value={formatNumber(matches)} />
          <StatCard icon="🏅" label="Wins" value={formatNumber(wins)} />
          <StatCard icon="😔" label="Losses" value={formatNumber(losses)} />
          <StatCard icon="📈" label="Win %" value={winPercent} highlight />
        </StatGrid>
      </div>

      {/* Combat Stats */}
      <div className="mb-8">
        <SectionTitle icon="🔫" title="Combat Stats" />
        <StatGrid cols={4}>
          <StatCard icon="🤝" label="Assists" value={formatNumber(assists)} />
          <StatCard icon="💥" label="Damage Dealt" value={formatNumber(damage)} />
          <StatCard icon="🎯" label="Headshot Kills" value={formatNumber(headshotKills)} />
          <StatCard icon="🧍" label="Human Kills" value={formatNumber(humanKills)} />
          <StatCard icon="⚡" label="Multi Kills" value={formatNumber(multiKills)} />
          <StatCard icon="🔥" label="Longest Streak" value={formatNumber(longestStreak)} />
          <StatCard icon="🔥" label="Shots Fired" value={formatNumber(shotsFired)} />
          <StatCard icon="🎯" label="Accuracy" value={accuracy} />
        </StatGrid>
      </div>

      {/* Support Stats */}
      <div className="mb-8">
        <SectionTitle icon="🩹" title="Support & Teamplay" />
        <StatGrid cols={6}>
          <StatCard icon="💉" label="Teammate Revives" value={formatNumber(revives)} />
          <StatCard icon="👥" label="Squad Revives" value={formatNumber(squadRevives)} />
          <StatCard icon="❤️" label="Heals" value={formatNumber(heals)} />
          <StatCard icon="🔧" label="Repairs" value={formatNumber(repairs)} />
          <StatCard icon="👁️" label="Spotted" value={formatNumber(spotted)} />
          <StatCard icon="⚾" label="Throwables" value={formatNumber(throwables)} />
        </StatGrid>
      </div>

      {/* Objective Stats */}
      <div className="mb-8">
        <SectionTitle icon="🏴" title="Objective Stats" />
        <StatGrid cols={4}>
          <StatCard icon="🚩" label="Captured" value={formatNumber(captured)} />
          <StatCard icon="⚔️" label="Neutralized" value={formatNumber(neutralized)} />
          <StatCard icon="⏰" label="Objective Time" value={formatTime(objTime)} />
          <StatCard icon="💥" label="Vehicles Destroyed" value={formatNumber(vehDestroyed)} />
        </StatGrid>
      </div>

      {/* Class Stats */}
      <div className="mb-8">
        <SectionTitle icon="🎖️" title="Class Stats" />
        <StatGrid cols="wide4">
          <ClassCard name="Assault" icon="⚔️" kills={getStat(stats, "kw_kit_assault")} deaths={getStat(stats, "deaths_kit_assault")} revives={getStat(stats, "revives_kit_assault")} score={getStat(stats, "scoreas_kit_assault")} time={getStat(stats, "tp_kit_assault")} />
          <ClassCard name="Engineer" icon="🔧" kills={getStat(stats, "kw_kit_engineer")} deaths={getStat(stats, "deaths_kit_engineer")} revives={getStat(stats, "revives_kit_engineer")} score={getStat(stats, "scoreas_kit_engineer")} time={getStat(stats, "tp_kit_engineer")} />
          <ClassCard name="Support" icon="🩹" kills={getStat(stats, "kw_kit_support")} deaths={getStat(stats, "deaths_kit_support")} revives={getStat(stats, "revives_kit_support")} score={getStat(stats, "scoreas_kit_support")} time={getStat(stats, "tp_kit_support")} />
          <ClassCard name="Recon" icon="🔭" kills={getStat(stats, "kw_kit_recon")} deaths={getStat(stats, "deaths_kit_recon")} revives={getStat(stats, "revives_kit_recon")} score={getStat(stats, "scoreas_kit_recon")} time={getStat(stats, "tp_kit_recon")} />
        </StatGrid>
      </div>

      {/* Weapon Type Kills */}
      <div className="mb-8">
        <SectionTitle icon="🔫" title="Weapon Type Kills" />
        <StatGrid cols={4}>
          <StatCard icon="🔫" label="AR" value={formatNumber(getStat(stats, "kills_ar_total"))} />
          <StatCard icon="💪" label="Carbine" value={formatNumber(getStat(stats, "kills_crb_total"))} />
          <StatCard icon="🎯" label="DMR" value={formatNumber(getStat(stats, "kills_dmr_total"))} />
          <StatCard icon="🔥" label="MG" value={formatNumber(getStat(stats, "kills_mg_total"))} />
          <StatCard icon="💨" label="SMG" value={formatNumber(getStat(stats, "kills_smg_total"))} />
          <StatCard icon="🔭" label="Sniper" value={formatNumber(getStat(stats, "kills_snp_total"))} />
          <StatCard icon="🔫" label="Pistol" value={formatNumber(getStat(stats, "kills_pst_total"))} />
          <StatCard icon="💥" label="Shotgun" value={formatNumber(getStat(stats, "kills_sg_total"))} />
        </StatGrid>
      </div>

      {/* Distance & Travel */}
      <div className="mb-8">
        <SectionTitle icon="🚶" title="Distance & Travel" />
        <StatGrid cols={5}>
          <StatCard icon="🚶" label="On Foot" value={formatNumber(getStat(stats, "distrav_foot_total"))} />
          <StatCard icon="🚗" label="Vehicle" value={formatNumber(getStat(stats, "distrav_veh_total"))} />
          <StatCard icon="🧑‍🤝‍🧑" label="Passenger" value={formatNumber(getStat(stats, "distrav_psgr_total"))} />
          <StatCard icon="🏎️" label="Driving Time" value={formatTime(getStat(stats, "driving_time_total"))} />
          <StatCard icon="✈️" label="Flying Time" value={formatTime(getStat(stats, "flying_time_total"))} />
        </StatGrid>
      </div>
    </div>
  );
}