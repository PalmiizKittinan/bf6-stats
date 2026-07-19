"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BF6Profile, ProfileStat, CompetitiveRank } from "@/types/bf6";

const PROFILE_API = "https://api.gametools.network/bf6/profile/";

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

interface ProfileProps {
  playerName: string;
  platform: string;
}

export default function Profile({ playerName, platform }: ProfileProps) {
  const [profile, setProfile] = useState<BF6Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchProfile = useCallback(async (name: string, plat: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        name: name,
        platform: plat,
        skip_battlelog: "true",
        lang: "en-us",
      });
      const res = await fetch(`${PROFILE_API}?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: BF6Profile = await res.json();
      setProfile(data);
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "Failed to fetch profile");
        setProfile(null);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProfile(playerName, platform);
  }, [playerName, platform, fetchProfile]);

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-grow text-danger mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-light">Loading profile for {playerName}...</h5>
      </div>
    );
  }

  if (error || !profile || !profile.playerProfiles?.length) {
    return (
      <div className="text-center py-5">
        <div className="stats-card p-4 mx-auto" style={{ maxWidth: 500 }}>
          <div className="fs-1 mb-3">⚠️</div>
          <h5 className="text-white mb-2">Profile Not Found</h5>
          <p className="text-muted">{error || "No profile data available."}</p>
        </div>
      </div>
    );
  }

  const p = profile.playerProfiles[0];
  const { stats, playerCard, totalDogTags, competitiveRanks, rankName } = p;

  // Extract key stats
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
      <div className="header-section py-4 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-auto">
              {playerCard.rankImage?.large && (
                <img
                  src={playerCard.rankImage.large}
                  alt={`Rank ${playerCard.rank}`}
                  style={{ width: 80, height: 80, objectFit: "contain" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>
            <div className="col">
              <h3 className="mb-1 fw-bold text-white">{playerName}</h3>
              <div className="d-flex flex-wrap gap-3">
                <span className="text-light">
                  Rank: <span className="fw-bold text-white">{playerCard.rank}</span>
                </span>
                <span className="text-light">
                  Title: <span className="fw-bold" style={{ color: "var(--bf6-accent)" }}>{rankName}</span>
                </span>
                <span className="text-light">
                  Badges: <span className="fw-bold text-white">{playerCard.badges}</span>
                </span>
                <span className="text-light">
                  Dog Tags: <span className="fw-bold text-white">{totalDogTags?.intValue ?? "-"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competitive Ranks */}
      {competitiveRanks.length > 0 && (
        <div className="mb-4">
          <h5 className="section-title">🏅 Competitive Ranks</h5>
          <div className="row g-3">
            {competitiveRanks.map((cr) => (
              <CompetitiveRankCard key={cr.type + cr.mode} rank={cr} />
            ))}
          </div>
        </div>
      )}

      {/* Core Profile Stats */}
      <div className="mb-4">
        <h5 className="section-title">📊 Profile Overview</h5>
        <div className="row g-3">
          <ProfileStatCard icon="⭐" label="Score" value={formatNumber(score)} />
          <ProfileStatCard icon="💀" label="Kills" value={formatNumber(kills)} />
          <ProfileStatCard icon="☠️" label="Deaths" value={formatNumber(deaths)} />
          <ProfileStatCard icon="📊" label="K/D" value={kdr} highlight />
          <ProfileStatCard icon="🎮" label="Matches" value={formatNumber(matches)} />
          <ProfileStatCard icon="🏅" label="Wins" value={formatNumber(wins)} />
          <ProfileStatCard icon="😔" label="Losses" value={formatNumber(losses)} />
          <ProfileStatCard icon="📈" label="Win %" value={winPercent} highlight />
        </div>
      </div>

      {/* Combat Stats */}
      <div className="mb-4">
        <h5 className="section-title">🔫 Combat Stats</h5>
        <div className="row g-3">
          <ProfileStatCard icon="🤝" label="Assists" value={formatNumber(assists)} />
          <ProfileStatCard icon="💥" label="Damage Dealt" value={formatNumber(damage)} />
          <ProfileStatCard icon="🎯" label="Headshot Kills" value={formatNumber(headshotKills)} />
          <ProfileStatCard icon="🧍" label="Human Kills" value={formatNumber(humanKills)} />
          <ProfileStatCard icon="⚡" label="Multi Kills" value={formatNumber(multiKills)} />
          <ProfileStatCard icon="🔥" label="Longest Streak" value={formatNumber(longestStreak)} />
          <ProfileStatCard icon="🔥" label="Shots Fired" value={formatNumber(shotsFired)} />
          <ProfileStatCard icon="🎯" label="Accuracy" value={accuracy} />
        </div>
      </div>

      {/* Support Stats */}
      <div className="mb-4">
        <h5 className="section-title">🩹 Support & Teamplay</h5>
        <div className="row g-3">
          <ProfileStatCard icon="💉" label="Teammate Revives" value={formatNumber(revives)} />
          <ProfileStatCard icon="👥" label="Squad Revives" value={formatNumber(squadRevives)} />
          <ProfileStatCard icon="❤️" label="Heals" value={formatNumber(heals)} />
          <ProfileStatCard icon="🔧" label="Repairs" value={formatNumber(repairs)} />
          <ProfileStatCard icon="👁️" label="Spotted" value={formatNumber(spotted)} />
          <ProfileStatCard icon="⚾" label="Throwables" value={formatNumber(throwables)} />
        </div>
      </div>

      {/* Objective Stats */}
      <div className="mb-4">
        <h5 className="section-title">🏴 Objective Stats</h5>
        <div className="row g-3">
          <ProfileStatCard icon="🚩" label="Captured" value={formatNumber(captured)} />
          <ProfileStatCard icon="⚔️" label="Neutralized" value={formatNumber(neutralized)} />
          <ProfileStatCard icon="⏰" label="Objective Time" value={formatTime(objTime)} />
          <ProfileStatCard icon="💥" label="Vehicles Destroyed" value={formatNumber(vehDestroyed)} />
        </div>
      </div>

      {/* Class Stats */}
      <div className="mb-4">
        <h5 className="section-title">🎖️ Class Stats</h5>
        <div className="row g-3">
          <ClassProfileCard
            name="Assault"
            icon="⚔️"
            kills={getStat(stats, "kw_kit_assault")}
            deaths={getStat(stats, "deaths_kit_assault")}
            revives={getStat(stats, "revives_kit_assault")}
            score={getStat(stats, "scoreas_kit_assault")}
            time={getStat(stats, "tp_kit_assault")}
          />
          <ClassProfileCard
            name="Engineer"
            icon="🔧"
            kills={getStat(stats, "kw_kit_engineer")}
            deaths={getStat(stats, "deaths_kit_engineer")}
            revives={getStat(stats, "revives_kit_engineer")}
            score={getStat(stats, "scoreas_kit_engineer")}
            time={getStat(stats, "tp_kit_engineer")}
          />
          <ClassProfileCard
            name="Support"
            icon="🩹"
            kills={getStat(stats, "kw_kit_support")}
            deaths={getStat(stats, "deaths_kit_support")}
            revives={getStat(stats, "revives_kit_support")}
            score={getStat(stats, "scoreas_kit_support")}
            time={getStat(stats, "tp_kit_support")}
          />
          <ClassProfileCard
            name="Recon"
            icon="🔭"
            kills={getStat(stats, "kw_kit_recon")}
            deaths={getStat(stats, "deaths_kit_recon")}
            revives={getStat(stats, "revives_kit_recon")}
            score={getStat(stats, "scoreas_kit_recon")}
            time={getStat(stats, "tp_kit_recon")}
          />
        </div>
      </div>

      {/* Weapon Type Kills */}
      <div className="mb-4">
        <h5 className="section-title">🔫 Weapon Type Kills</h5>
        <div className="row g-3">
          <ProfileStatCard icon="🔫" label="AR" value={formatNumber(getStat(stats, "kills_ar_total"))} />
          <ProfileStatCard icon="💪" label="Carbine" value={formatNumber(getStat(stats, "kills_crb_total"))} />
          <ProfileStatCard icon="🎯" label="DMR" value={formatNumber(getStat(stats, "kills_dmr_total"))} />
          <ProfileStatCard icon="🔥" label="MG" value={formatNumber(getStat(stats, "kills_mg_total"))} />
          <ProfileStatCard icon="💨" label="SMG" value={formatNumber(getStat(stats, "kills_smg_total"))} />
          <ProfileStatCard icon="🔭" label="Sniper" value={formatNumber(getStat(stats, "kills_snp_total"))} />
          <ProfileStatCard icon="🔫" label="Pistol" value={formatNumber(getStat(stats, "kills_pst_total"))} />
          <ProfileStatCard icon="💥" label="Shotgun" value={formatNumber(getStat(stats, "kills_sg_total"))} />
        </div>
      </div>

      {/* Distance & Travel */}
      <div className="mb-4">
        <h5 className="section-title">🚶 Distance & Travel</h5>
        <div className="row g-3">
          <ProfileStatCard icon="🚶" label="On Foot" value={formatNumber(getStat(stats, "distrav_foot_total"))} />
          <ProfileStatCard icon="🚗" label="Vehicle" value={formatNumber(getStat(stats, "distrav_veh_total"))} />
          <ProfileStatCard icon="🧑‍🤝‍🧑" label="Passenger" value={formatNumber(getStat(stats, "distrav_psgr_total"))} />
          <ProfileStatCard icon="🏎️" label="Driving Time" value={formatTime(getStat(stats, "driving_time_total"))} />
          <ProfileStatCard icon="✈️" label="Flying Time" value={formatTime(getStat(stats, "flying_time_total"))} />
        </div>
      </div>
    </div>
  );
}

function ProfileStatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="col-6 col-md-4 col-lg-2">
      <div className="stats-card p-3 text-center h-100">
        <div className="fs-4 mb-1">{icon}</div>
        <div className={`stat-value ${highlight ? "stat-highlight" : ""}`} style={{ fontSize: "1.4rem" }}>
          {value}
        </div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function CompetitiveRankCard({ rank }: { rank: CompetitiveRank }) {
  const isUnranked = rank.rankName === "Unranked";
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="stats-card p-3 h-100">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="text-muted small">{rank.modeName}</div>
            <div
              className="fw-bold"
              style={{ fontSize: "1.2rem", color: isUnranked ? "var(--bf6-text-muted)" : "var(--bf6-accent)" }}
            >
              {rank.rankName}
            </div>
          </div>
          <div className="badge bg-secondary">{rank.type}</div>
        </div>
      </div>
    </div>
  );
}

function ClassProfileCard({
  name,
  icon,
  kills,
  deaths,
  revives,
  score,
  time,
}: {
  name: string;
  icon: string;
  kills?: number;
  deaths?: number;
  revives?: number;
  score?: number;
  time?: number;
}) {
  const kdr = kills && deaths && deaths > 0 ? (kills / deaths).toFixed(2) : "-";

  return (
    <div className="col-12 col-md-6 col-lg-3">
      <div className="stats-card p-3 h-100">
        <h6 className="text-white fw-bold mb-3">
          {icon} {name}
        </h6>
        <div className="row g-2">
          <div className="col-6">
            <div className="text-muted small">Kills</div>
            <div className="fw-bold text-white">{formatNumber(kills)}</div>
          </div>
          <div className="col-6">
            <div className="text-muted small">Deaths</div>
            <div className="fw-bold text-white">{formatNumber(deaths)}</div>
          </div>
          <div className="col-6">
            <div className="text-muted small">K/D</div>
            <div className="fw-bold stat-highlight">{kdr}</div>
          </div>
          <div className="col-6">
            <div className="text-muted small">Revives</div>
            <div className="fw-bold text-white">{formatNumber(revives)}</div>
          </div>
          <div className="col-6">
            <div className="text-muted small">Score</div>
            <div className="fw-bold text-white">{formatNumber(score)}</div>
          </div>
          <div className="col-6">
            <div className="text-muted small">Time</div>
            <div className="fw-bold text-white">{formatTime(time)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}