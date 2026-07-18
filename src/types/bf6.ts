export interface BF6Stats {
  userId: string;
  avatar: string;
  userName: string;
  id: string;
  humanPrecentage: string;
  score: number;
  kills: number;
  deaths: number;
  wins: number;
  loses: number;
  assists: number;
  killsPerMinute: number;
  damagePerMinute: number;
  killsPerMatch: number;
  damagePerMatch: number;
  headShots: number;
  winPercent: string;
  headshots: string;
  killDeath: number;
  infantryKillDeath: number;
  damage: number;
  timePlayed: string;
  accuracy: string;
  revives: number;
  heals: number;
  resupplies: number;
  repairs: number;
  squadmateRevive: number;
  thrownThrowables: number;
  inRound: {
    revives: number;
    resupplies: number;
    spotAssists: number;
    thrownThrowables: number;
    playerTakeDowns: number;
  };
  gadgetsDestoyed: number;
  playerTakeDowns: number;
  matchesPlayed: number;
  secondsPlayed: number;
  dividedSecondsPlayed: {
    flying: number;
    driving: number;
  };
  saviorKills: number;
  shotsFired: number;
  shotsHit: number;
  humanShotsHit: number;
  killAssists: number;
  vehiclesDestroyed: number;
  enemiesSpotted: number;
  lastPlacement: number;
  dividedKills: {
    confirmed: number;
    fullConfirmed: number;
    ads: number;
    grenades: number;
    hipfire: number;
    longDistance: number;
    melee: number;
    multiKills: number;
    passenger: number;
    vehicle: number;
    roadkills: number;
    parachute: number;
    human: number;
    weapons: {
      SMG: number;
      LMG: number;
      DMR: number;
      AR: number;
      MG: number;
      Pistols: number;
      Snipers: number;
      Shotguns: number;
    };
    inRound: {
      total: number;
      grenade: number;
      headshots: number;
      melee: number;
      multiKills: number;
      weapons: {
        SMG: number;
        AR: number;
        DMR: number;
      };
    };
  };
  devidedDamage: {
    human: number;
    explosive: number;
    passenger: number;
    vehicleDriver: number;
    toVehicle: number;
    withVehicle: number;
    inRound: {
      asVehicle: number;
    };
  };
  devidedAssists: {
    human: number;
    driver: number;
    passenger: number;
    spot: number;
    pilot: number;
    inRound: {
      total: number;
    };
  };
  distanceTraveled: {
    foot: number;
    passenger: number;
    vehicle: number;
  };
  sector: {
    captured: number;
  };
  objective: {
    time: {
      total: number;
      attacked: number;
      defended: number;
    };
    armed: number;
    captured: number;
    neutralized: number;
    defused: number;
    destroyed: number;
    inRound: {
      armed: number;
      captured: number;
      neutralized: number;
      defused: number;
      destroyed: number;
    };
  };
  XP: {
    total: number;
    performance: number;
    accolades: number;
  }[];
  bestClass: string;
  hasResults: boolean;
  platform: string;
  platformId: number;
  seasons: Season[];
  redsec: Season[];
  weapons?: WeaponDetail[];
  vehicles?: VehicleDetail[];
  weaponGroups?: WeaponGroup[];
  vehicleGroups?: VehicleGroup[];
  classes?: ClassDetail[];
  maps?: MapDetail[];
  gameModes?: GameModeDetail[];
  gameModeGroups?: GameModeGroup[];
  gadgets?: GadgetDetail[];
  gadgetGroups?: GadgetGroup[];
  melee?: MeleeDetail[];
  meleeGroups?: MeleeGroup[];
  battlePickups?: unknown[];
  vehicleArchetypes?: VehicleArchetype[];
}

export interface Season {
  seasonId: string;
  season: string;
  modes: GameMode[];
}

export interface GameMode {
  modeId: string;
  mode: string;
  matches: number;
  wins: number;
  losses: number;
  kills: number;
  rivivals: number;
  lastPlacement: number;
  deaths: number;
  killDeath: number;
  score: number;
  secondsPlayed: number;
  timePlayed: string;
  extractions: number;
}

export interface WeaponDetail {
  type: string;
  weaponName: string;
  image: string;
  altImage: string;
  translationId: string;
  name: string;
  id: string;
  kills: number;
  damage: number;
  assistsDamage: number;
  bodyKills: number;
  headshotKills: number;
  hipfireKills: number;
  multiKills: number;
  accuracy: string;
  killsPerMinute: number;
  damagePerMinute: number;
  headshots: string;
  hitVKills: number;
  shotsHit: number;
  shotsFired: number;
  scopedKills: number;
  spawns: number;
  timeEquipped: number;
}

export interface VehicleDetail {
  type: string;
  vehicleName: string;
  image: string;
  altImage: string;
  translationId: string | null;
  name: string;
  id: string;
  kills: number;
  killsPerMinute: number;
  damage: number;
  spawns: number;
  roadKills: number;
  passengerAssists: number;
  multiKills: number;
  distanceTraveled: number;
  driverAssists: number;
  vehiclesDestroyedWith: number;
  assists: number;
  damageTo: number;
  destroyed: number;
  airtime: number;
  timeIn: number;
}

export interface WeaponGroup {
  groupName: string;
  translationId: string;
  name: string;
  id: string;
  kills: number;
  damage: number;
  assistsDamage: number;
  bodyKills: number;
  headshotKills: number;
  hipfireKills: number;
  multiKills: number;
  accuracy: string;
  killsPerMinute: number;
  damagePerMinute: number;
  headshots: string;
  hitVKills: number;
  shotsHit: number;
  shotsFired: number;
  scopedKills: number;
  spawns: number;
  timeEquipped: number;
}

export interface VehicleGroup {
  groupName: string;
  name: string;
  id: string;
  kills: number;
  killsPerMinute: number;
  damage: number;
  spawns: number;
  roadKills: number;
  passengerAssists: number;
  multiKills: number;
  distanceTraveled: number;
  driverAssists: number;
  vehiclesDestroyedWith: number;
  assists: number;
  damageTo: number;
  destroyed: number;
  airtime: number;
  timeIn: number;
}

export interface ClassDetail {
  className: string;
  image: string;
  altImage: string;
  translationId: string;
  name: string;
  id: string;
  kills: number;
  deaths: number;
  kpm: number;
  killDeath: number;
  spawns: number;
  score: number;
  assists: number;
  revives: number;
  secondsPlayed: number;
}

export interface MapDetail {
  mapName: string;
  image: string;
  translationId: string;
  name: string;
  id: string;
  wins: number;
  losses: number;
  matches: number;
  winPercent: string;
  secondsPlayed: number;
}

export interface GameModeDetail {
  gamemodeName: string;
  image: string;
  altImage: string;
  id: string;
  kills: number;
  deaths: number;
  wins: number;
  losses: number;
  killDeath: number;
  winPercent: string;
  killAssists: number;
  matches: number;
  repairs: number;
  revives: number;
  spots: number;
  respawns: number;
  objectiveTime: number;
  objectivesCaptured: number;
  objectivesDefended: number;
  objectivesDestroyed: number;
  objectivesArmed: number;
  objectivesDisarmed: number;
  vehiclesDestroyedWith: number;
  sectorsDefended: number;
  intelPickups: number;
  scoreIn: number;
  health: number;
  killsWith: number;
  headshotKills: number;
  headshots: string;
  kpm: number;
  dpm: number;
  secondsPlayed: number;
  topOfLeaderboard: {
    topTwo: number;
    topThree: number;
    topFour: number;
    topFive: number;
    topTen: number;
  };
}

export interface GameModeGroup {
  gamemodeName: string;
  image: string;
  altImage: string;
  id: string;
  kills: number;
  deaths: number;
  wins: number;
  losses: number;
  killDeath: number;
  winPercent: string;
  killAssists: number;
  matches: number;
  repairs: number;
  revives: number;
  spots: number;
  respawns: number;
  objectiveTime: number;
  objectivesCaptured: number;
  objectivesDefended: number;
  objectivesDestroyed: number;
  objectivesArmed: number;
  objectivesDisarmed: number;
  vehiclesDestroyedWith: number;
  sectorsDefended: number;
  intelPickups: number;
  scoreIn: number;
  health: number;
  killsWith: number;
  headshotKills: number;
  headshots: string;
  kpm: number;
  dpm: number;
  secondsPlayed: number;
}

export interface GadgetDetail {
  type: string;
  gadgetName: string;
  image: string;
  translationId: string | null;
  name: string;
  id: string;
  kills: number;
  assistsDamage: number;
  assists: number;
  explosiveDamageWith: number;
  spotAssists: number;
  spots: number;
  spawns: number;
  damage: number;
  repairs: number;
  uses: number;
  multiKills: number;
  vehiclesDestroyedWith: number;
  kpm: number;
  dpm: number;
  secondsPlayed: number;
}

export interface GadgetGroup {
  groupName: string;
  translationId: string | null;
  name: string;
  id: string;
  kills: number;
  assistsDamage: number;
  assists: number;
  explosiveDamageWith: number;
  spotAssists: number;
  spots: number;
  spawns: number;
  damage: number;
  repairs: number;
  uses: number;
  multiKills: number;
  vehiclesDestroyedWith: number;
  kpm: number;
  dpm: number;
  secondsPlayed: number;
}

export interface MeleeDetail {
  type: string;
  meleeName: string;
  image: string;
  translationId: string;
  id: string;
  name: string;
  kills: number;
  damage: number;
  takedowns: number;
  uses: number;
  killsPerMinute: number;
  damagePerMinute: number;
  timeEquipped: number;
}

export interface MeleeGroup {
  groupName: string;
  id: string;
  name: string;
  kills: number;
  damage: number;
  takedowns: number;
  uses: number;
  killsPerMinute: number;
  damagePerMinute: number;
  timeEquipped: number;
}

export interface VehicleArchetype {
  archetypeName: string;
  name: string | null;
  id: string;
  kills: number;
  killsPerMinute: number;
  damage: number;
  spawns: number;
  roadKills: number;
  passengerAssists: number;
  multiKills: number;
  distanceTraveled: number;
  driverAssists: number;
  vehiclesDestroyedWith: number;
  assists: number;
  damageTo: number;
  destroyed: number;
  airtime: number;
  timeIn: number;
}