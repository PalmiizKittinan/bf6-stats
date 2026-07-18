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
  bestClass: string;
  hasResults: boolean;
  platform: string;
  platformId: number;
  seasons: Season[];
  redsec: Season[];
  weapons?: Weapon[];
  vehicles?: Vehicle[];
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

export interface Weapon {
  weaponName: string;
  id: string;
  kills: number;
  killsPerMinute: number;
  headshots: number;
  headshotAccuracy: string;
  shotsFired: number;
  shotsHit: number;
  accuracy: string;
  damage: number;
  timeUsed: number;
  weaponType: string;
}

export interface Vehicle {
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