"use client";

import { ProfileStat, CompetitiveRank } from "@/types/bf6";
import { usePlayerStore } from "@/store/usePlayerStore";
import { StatCard, SectionTitle } from "./TailwindShared";

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
    <div className="w-full sm:w-1/2 lg:w-1/4 p-1.5">
      <div className="tw-glass-card tw-stat-tile p-4 h-full">
        <div className="flex items-center gap-2 mb-3">
          <span className="tw-icon-badge tw-icon-badge-sm">{icon}</span>
          <h6 className="font-bold" style={{ color: "var(--bf6-text-strong)" }}>{name}</h6>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Kills</div><div className="font-bold tabular-nums" style={{ color: "var(--bf6-text-strong)" }}>{formatNumber(kills)}</div></div>
          <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Deaths</div><div className="font-bold tabular-nums" style={{ color: "var(--bf6-text-strong)" }}>{formatNumber(deaths)}</div></div>
          <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>K/D</div><div className="font-bold tabular-nums tw-gradient-text">{kdr}</div></div>
          <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Revives</div><div className="font-bold tabular-nums" style={{ color: "var(--bf6-text-strong)" }}>{formatNumber(revives)}</div></div>
          <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Score</div><div className="font-bold tabular-nums" style={{ color: "var(--bf6-text-strong)" }}>{formatNumber(score)}</div></div>
          <div><div className="text-xs" style={{ color: "var(--bf6-text-muted)" }}>Time</div><div className="font-bold tabular-nums" style={{ color: "var(--bf6-text-strong)" }}>{formatTime(time)}</div></div>
        </div>
      </div>
    </div>
  );
}

function CompRankCard({ rank }: { rank: CompetitiveRank }) {
  const isUnranked = rank.rankName === "Unranked";
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 p-1.5">
      <div className="tw-glass-card tw-stat-tile p-4 h-full">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider" style={{ color: "var(--bf6-text-muted)" }}>{rank.modeName}</div>
            <div className={`font-bold text-lg ${isUnranked ? "" : "tw-gradient-text"}`} style={{ color: isUnranked ? "var(--bf6-text-muted)" : undefined }}>
              {rank.rankName}
            </div>
          </div>
          <span className="tw-pill">{rank.type}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProfileTW() {
  const { playerName, profile, profileLoading, profileError, fetchProfile } = usePlayerStore();

  const handleRefresh = () => { if (playerName) fetchProfile(); };

  if (!playerName) {
    return (
      <div className="text-center py-24">
        <div className="tw-glass-card tw-fade-in relative overflow-hidden p-10 mx-auto" style={{ maxWidth: 520 }}>
          <div className="tw-mesh" />
          <div className="tw-icon-badge mx-auto mb-4 relative" style={{ width: 64, height: 64, fontSize: "2rem" }}>🎮</div>
          <h3 className="font-bold text-2xl mb-3 tw-gradient-text relative">Welcome to BF6 Stats</h3>
          <p className="relative" style={{ color: "var(--bf6-text-muted)" }}>Please enter a player name in the search bar above to start tracking stats.</p>
        </div>
      </div>
    );
  }

  if (profileLoading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div
          className="w-12 h-12 rounded-full animate-spin mb-4"
          style={{ border: "4px solid var(--bf6-border)", borderTopColor: "var(--bf6-accent)" }}
        />
        <h5 style={{ color: "var(--bf6-text-strong)" }}>Loading profile for {playerName}...</h5>
      </div>
    );
  }

  if (profileError || !profile || !profile.playerProfiles?.length) {
    return (
      <div className="text-center py-24">
        <div className="tw-glass-card tw-fade-in p-8 mx-auto" style={{ maxWidth: 500 }}>
          <div className="text-6xl mb-3">⚠️</div>
          <h5 className="text-xl mb-2" style={{ color: "var(--bf6-text-strong)" }}>Profile Not Found</h5>
          <p style={{ color: "var(--bf6-text-muted)" }}>{profileError || "No profile data available."}</p>
        </div>
      </div>
    );
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
      <div className="flex justify-end mb-4">
        <button className="tw-btn" onClick={handleRefresh}>
          🔄 Refresh
        </button>
      </div>

      {profileLoading && profile && (
        <div className="flex items-center justify-center py-2 mb-4">
          <div
            className="w-5 h-5 rounded-full animate-spin mr-2"
            style={{ border: "2px solid var(--bf6-border)", borderTopColor: "var(--bf6-accent)" }}
          />
          <span style={{ color: "var(--bf6-text-strong)" }}>Refreshing data...</span>
        </div>
      )}

      {/* Player Card Header */}
      <div className="tw-glass-card tw-fade-in relative overflow-hidden py-6 mb-6 rounded-2xl">
        <div className="tw-mesh" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex items-center gap-4 flex-wrap">
            {playerCard.rankImage?.large && (
              <img src={playerCard.rankImage.large} alt={`Rank ${playerCard.rank}`} className="w-20 h-20 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <div>
              <h3 className="text-xl font-bold mb-2 tw-gradient-text">{playerName}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="tw-pill">
                  Rank: <b style={{ color: "var(--bf6-text-strong)" }}>{playerCard.rank}</b>
                </span>
                <span className="tw-pill">
                  <b className="tw-gradient-text">{rankName}</b>
                </span>
                <span className="tw-pill">
                  Badges: <b style={{ color: "var(--bf6-text-strong)" }}>{playerCard.badges}</b>
                </span>
                <span className="tw-pill">
                  Dog Tags: <b style={{ color: "var(--bf6-text-strong)" }}>{totalDogTags?.intValue ?? "-"}</b>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competitive Ranks */}
      {competitiveRanks.length > 0 && (
        <div className="mb-6">
          <SectionTitle icon="🏅" title="Competitive Ranks" />
          <div className="flex flex-wrap -mx-1.5">{competitiveRanks.map((cr: CompetitiveRank) => <CompRankCard key={cr.type + cr.mode} rank={cr} />)}</div>
        </div>
      )}

      {/* Profile Overview */}
      <div className="mb-6">
        <SectionTitle icon="📊" title="Profile Overview" />
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="⭐" label="Score" value={formatNumber(score)} />
          <StatCard icon="💀" label="Kills" value={formatNumber(kills)} />
          <StatCard icon="☠️" label="Deaths" value={formatNumber(deaths)} />
          <StatCard icon="📊" label="K/D" value={kdr} highlight />
          <StatCard icon="🎮" label="Matches" value={formatNumber(matches)} />
          <StatCard icon="🏅" label="Wins" value={formatNumber(wins)} />
          <StatCard icon="😔" label="Losses" value={formatNumber(losses)} />
          <StatCard icon="📈" label="Win %" value={winPercent} highlight />
        </div>
      </div>

      {/* Combat Stats */}
      <div className="mb-6">
        <SectionTitle icon="🔫" title="Combat Stats" />
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="🤝" label="Assists" value={formatNumber(assists)} />
          <StatCard icon="💥" label="Damage Dealt" value={formatNumber(damage)} />
          <StatCard icon="🎯" label="Headshot Kills" value={formatNumber(headshotKills)} />
          <StatCard icon="🧍" label="Human Kills" value={formatNumber(humanKills)} />
          <StatCard icon="⚡" label="Multi Kills" value={formatNumber(multiKills)} />
          <StatCard icon="🔥" label="Longest Streak" value={formatNumber(longestStreak)} />
          <StatCard icon="🔥" label="Shots Fired" value={formatNumber(shotsFired)} />
          <StatCard icon="🎯" label="Accuracy" value={accuracy} />
        </div>
      </div>

      {/* Support Stats */}
      <div className="mb-6">
        <SectionTitle icon="🩹" title="Support & Teamplay" />
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="💉" label="Teammate Revives" value={formatNumber(revives)} />
          <StatCard icon="👥" label="Squad Revives" value={formatNumber(squadRevives)} />
          <StatCard icon="❤️" label="Heals" value={formatNumber(heals)} />
          <StatCard icon="🔧" label="Repairs" value={formatNumber(repairs)} />
          <StatCard icon="👁️" label="Spotted" value={formatNumber(spotted)} />
          <StatCard icon="⚾" label="Throwables" value={formatNumber(throwables)} />
        </div>
      </div>

      {/* Objective Stats */}
      <div className="mb-6">
        <SectionTitle icon="🏴" title="Objective Stats" />
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="🚩" label="Captured" value={formatNumber(captured)} />
          <StatCard icon="⚔️" label="Neutralized" value={formatNumber(neutralized)} />
          <StatCard icon="⏰" label="Objective Time" value={formatTime(objTime)} />
          <StatCard icon="💥" label="Vehicles Destroyed" value={formatNumber(vehDestroyed)} />
        </div>
      </div>

      {/* Class Stats */}
      <div className="mb-6">
        <SectionTitle icon="🎖️" title="Class Stats" />
        <div className="flex flex-wrap -mx-1.5">
          <ClassCard name="Assault" icon="⚔️" kills={getStat(stats, "kw_kit_assault")} deaths={getStat(stats, "deaths_kit_assault")} revives={getStat(stats, "revives_kit_assault")} score={getStat(stats, "scoreas_kit_assault")} time={getStat(stats, "tp_kit_assault")} />
          <ClassCard name="Engineer" icon="🔧" kills={getStat(stats, "kw_kit_engineer")} deaths={getStat(stats, "deaths_kit_engineer")} revives={getStat(stats, "revives_kit_engineer")} score={getStat(stats, "scoreas_kit_engineer")} time={getStat(stats, "tp_kit_engineer")} />
          <ClassCard name="Support" icon="🩹" kills={getStat(stats, "kw_kit_support")} deaths={getStat(stats, "deaths_kit_support")} revives={getStat(stats, "revives_kit_support")} score={getStat(stats, "scoreas_kit_support")} time={getStat(stats, "tp_kit_support")} />
          <ClassCard name="Recon" icon="🔭" kills={getStat(stats, "kw_kit_recon")} deaths={getStat(stats, "deaths_kit_recon")} revives={getStat(stats, "revives_kit_recon")} score={getStat(stats, "scoreas_kit_recon")} time={getStat(stats, "tp_kit_recon")} />
        </div>
      </div>

      {/* Weapon Type Kills */}
      <div className="mb-6">
        <SectionTitle icon="🔫" title="Weapon Type Kills" />
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="🔫" label="AR" value={formatNumber(getStat(stats, "kills_ar_total"))} />
          <StatCard icon="💪" label="Carbine" value={formatNumber(getStat(stats, "kills_crb_total"))} />
          <StatCard icon="🎯" label="DMR" value={formatNumber(getStat(stats, "kills_dmr_total"))} />
          <StatCard icon="🔥" label="MG" value={formatNumber(getStat(stats, "kills_mg_total"))} />
          <StatCard icon="💨" label="SMG" value={formatNumber(getStat(stats, "kills_smg_total"))} />
          <StatCard icon="🔭" label="Sniper" value={formatNumber(getStat(stats, "kills_snp_total"))} />
          <StatCard icon="🔫" label="Pistol" value={formatNumber(getStat(stats, "kills_pst_total"))} />
          <StatCard icon="💥" label="Shotgun" value={formatNumber(getStat(stats, "kills_sg_total"))} />
        </div>
      </div>

      {/* Distance & Travel */}
      <div className="mb-6">
        <SectionTitle icon="🚶" title="Distance & Travel" />
        <div className="flex flex-wrap -mx-1.5">
          <StatCard icon="🚶" label="On Foot" value={formatNumber(getStat(stats, "distrav_foot_total"))} />
          <StatCard icon="🚗" label="Vehicle" value={formatNumber(getStat(stats, "distrav_veh_total"))} />
          <StatCard icon="🧑‍🤝‍🧑" label="Passenger" value={formatNumber(getStat(stats, "distrav_psgr_total"))} />
          <StatCard icon="🏎️" label="Driving Time" value={formatTime(getStat(stats, "driving_time_total"))} />
          <StatCard icon="✈️" label="Flying Time" value={formatTime(getStat(stats, "flying_time_total"))} />
        </div>
      </div>
    </div>
  );
}