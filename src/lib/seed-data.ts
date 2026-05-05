export type Song = { song: string; artist: string };

export type Pin = {
  id: string;
  x: number;
  y: number;
  label: string;
  count: number;
  hot?: boolean;
  mood: string;
  listening: number;
  tags: string[];
  songs: Song[];
};

export type Trace = {
  id: string;
  userId: string;
  userInitial: string;
  userColor: string;
  song: string;
  artist: string;
  place: string;
  locationId?: string;
  note: string;
  mood: string;
  time: string;
  unread?: boolean;
  /** Which song this trace was written for. Drives danmaku filtering on Playing page. */
  forSong: { song: string; artist: string };
};

export type SeedPlaylist = {
  id: string;
  name: string;
  count: number;
  gradient: string;
  moods: string[];
  locationId?: string;
  source: "seed";
};

export const PINS: Pin[] = [
  {
    id: "uts",
    x: 22, y: 28,
    label: "UTS Library",
    count: 124, hot: true,
    mood: "Quiet, focused, late-afternoon",
    listening: 12,
    tags: ["focus", "calm", "instrumental"],
    songs: [
      { song: "An Ending (Ascent)", artist: "Brian Eno" },
      { song: "光るなら", artist: "Goose house" },
      { song: "Avril 14th", artist: "Aphex Twin" },
      { song: "Weightless", artist: "Marconi Union" },
      { song: "Spiegel im Spiegel", artist: "Arvo Pärt" },
      { song: "Music for Airports 1/1", artist: "Brian Eno" },
      { song: "Re:Stacks", artist: "Bon Iver" },
      { song: "Saman", artist: "Ólafur Arnalds" },
    ],
  },
  {
    id: "central",
    x: 62, y: 18,
    label: "Central Stn",
    count: 78,
    mood: "Rushed mornings, slow evenings",
    listening: 23,
    tags: ["commute", "drive", "indie"],
    songs: [
      { song: "Motion Picture Soundtrack", artist: "Radiohead" },
      { song: "Re:Stacks", artist: "Bon Iver" },
      { song: "Cellophane", artist: "FKA twigs" },
      { song: "Two Weeks", artist: "Grizzly Bear" },
      { song: "Dawn Chorus", artist: "Thom Yorke" },
    ],
  },
  {
    id: "strand",
    x: 78, y: 44,
    label: "Strand Arcade",
    count: 31,
    mood: "Wandering, golden hour",
    listening: 4,
    tags: ["soft", "vintage", "wander"],
    songs: [
      { song: "Sunday Morning", artist: "The Velvet Underground" },
      { song: "La Vie en Rose", artist: "Édith Piaf" },
      { song: "Moon River", artist: "Frank Ocean" },
      { song: "Harvest Moon", artist: "Neil Young" },
    ],
  },
  {
    id: "glebe",
    x: 38, y: 56,
    label: "Glebe café",
    count: 56,
    mood: "First-coffee thoughts",
    listening: 8,
    tags: ["acoustic", "warm", "morning"],
    songs: [
      { song: "Skinny Love", artist: "Bon Iver" },
      { song: "Holocene", artist: "Bon Iver" },
      { song: "First Day of My Life", artist: "Bright Eyes" },
      { song: "Daylight", artist: "Matt and Kim" },
    ],
  },
  {
    id: "wynyard",
    x: 70, y: 70,
    label: "Wynyard",
    count: 92, hot: true,
    mood: "The line wants to go home softly",
    listening: 18,
    tags: ["home", "soft", "tunnel"],
    songs: [
      { song: "Lover, You Should've Come Over", artist: "Jeff Buckley" },
      { song: "夜に駆ける", artist: "YOASOBI" },
      { song: "Nikes", artist: "Frank Ocean" },
      { song: "Self Control", artist: "Frank Ocean" },
      { song: "I Know the End", artist: "Phoebe Bridgers" },
      { song: "Liability", artist: "Lorde" },
    ],
  },
  {
    id: "broadway",
    x: 28, y: 78,
    label: "Broadway gym",
    count: 19,
    mood: "Suffering, together",
    listening: 6,
    tags: ["energy", "loud", "alive"],
    songs: [
      { song: "Cha Cha", artist: "Freddie Dredd" },
      { song: "HUMBLE.", artist: "Kendrick Lamar" },
      { song: "Power", artist: "Kanye West" },
      { song: "Black Skinhead", artist: "Kanye West" },
    ],
  },
];

export const FEED: Trace[] = [
  {
    id: "t1",
    userId: "mei",
    userInitial: "M",
    userColor: "#F5C26B",
    song: "Motion Picture Soundtrack",
    artist: "Radiohead",
    place: "T9 · Strathfield",
    locationId: "central",
    note: "tunnel just before home. cried a little. it was fine.",
    mood: "soft",
    time: "2h",
    unread: true,
    forSong: { song: "Motion Picture Soundtrack", artist: "Radiohead" },
  },
  {
    id: "t2",
    userId: "kai",
    userInitial: "K",
    userColor: "#B68CFF",
    song: "夜に駆ける",
    artist: "YOASOBI",
    place: "UTS Library · L7",
    locationId: "uts",
    note: "first all-nighter. somehow felt like everyone here was awake with me.",
    mood: "alive",
    time: "5h",
    unread: true,
    forSong: { song: "An Ending (Ascent)", artist: "Brian Eno" },
  },
  {
    id: "t3",
    userId: "ren",
    userInitial: "R",
    userColor: "#FF8A9B",
    song: "Sunday Morning",
    artist: "The Velvet Underground",
    place: "Single O, Surry Hills",
    note: "the barista remembered my order. small, but it counted.",
    mood: "hopeful",
    time: "1d",
    unread: true,
    forSong: { song: "Sunday Morning", artist: "The Velvet Underground" },
  },
  {
    id: "t4",
    userId: "ash",
    userInitial: "A",
    userColor: "#7AC9C6",
    song: "Cha Cha",
    artist: "Freddie Dredd",
    place: "Fitness First Broadway",
    locationId: "broadway",
    note: "leg day. nobody talks here either but at least we're suffering together.",
    mood: "alive",
    time: "1d",
    forSong: { song: "Cha Cha", artist: "Freddie Dredd" },
  },
  {
    id: "t5",
    userId: "noa",
    userInitial: "N",
    userColor: "#E89F71",
    song: "Lover, You Should've Come Over",
    artist: "Jeff Buckley",
    place: "Wynyard platform 3",
    locationId: "wynyard",
    note: "missed my train on purpose to finish it.",
    mood: "lonely",
    time: "2d",
    forSong: { song: "Lover, You Should've Come Over", artist: "Jeff Buckley" },
  },
  {
    id: "t6",
    userId: "yui",
    userInitial: "Y",
    userColor: "#9DD17A",
    song: "Skinny Love",
    artist: "Bon Iver",
    place: "Glebe café",
    locationId: "glebe",
    note: "rain on the window. coffee got cold. didn't mind.",
    mood: "soft",
    time: "3d",
    forSong: { song: "Skinny Love", artist: "Bon Iver" },
  },
  {
    id: "t7",
    userId: "leo",
    userInitial: "L",
    userColor: "#C49EFF",
    song: "Avril 14th",
    artist: "Aphex Twin",
    place: "UTS Library · L5",
    locationId: "uts",
    note: "thesis at 2am. this song held me upright.",
    mood: "calm",
    time: "4d",
    forSong: { song: "An Ending (Ascent)", artist: "Brian Eno" },
  },
  {
    id: "t8",
    userId: "mei",
    userInitial: "M",
    userColor: "#F5C26B",
    song: "An Ending (Ascent)",
    artist: "Brian Eno",
    place: "UTS Library · L5",
    locationId: "uts",
    note: "Played this on my third night in Sydney. Fell asleep at this desk. Woke up still feeling held.",
    mood: "calm",
    time: "6w",
    forSong: { song: "An Ending (Ascent)", artist: "Brian Eno" },
  },
  {
    id: "t9",
    userId: "noa",
    userInitial: "N",
    userColor: "#E89F71",
    song: "An Ending (Ascent)",
    artist: "Brian Eno",
    place: "UTS Library · L7",
    locationId: "uts",
    note: "rain outside. perfect for thesis writing.",
    mood: "soft",
    time: "8h",
    forSong: { song: "An Ending (Ascent)", artist: "Brian Eno" },
  },
];

/** Find traces relevant to a playing song, with fallback to same location. */
export function findTracesForSong(song: string | undefined, artist: string | undefined, locationId: string | undefined): Trace[] {
  if (!song || !artist) return [];
  const exact = FEED.filter((t) => t.forSong.song === song && t.forSong.artist === artist);
  if (exact.length >= 2) return exact;
  if (locationId) {
    const sameLoc = FEED.filter((t) => t.locationId === locationId);
    return [...exact, ...sameLoc.filter((t) => !exact.includes(t))];
  }
  return exact;
}

export const SEED_PLAYLISTS: SeedPlaylist[] = [
  {
    id: "sp1",
    name: "UTS Library · study self",
    count: 24,
    gradient: "from-primary to-warm/60",
    moods: ["calm", "focus"],
    locationId: "uts",
    source: "seed",
  },
  {
    id: "sp2",
    name: "Wynyard, going home",
    count: 18,
    gradient: "from-warm to-destructive/60",
    moods: ["soft", "homesick"],
    locationId: "wynyard",
    source: "seed",
  },
  {
    id: "sp3",
    name: "Single O mornings",
    count: 11,
    gradient: "from-warm/80 to-primary/70",
    moods: ["hopeful", "warm"],
    source: "seed",
  },
  {
    id: "sp4",
    name: "Broadway, leg day",
    count: 9,
    gradient: "from-primary to-background",
    moods: ["alive"],
    locationId: "broadway",
    source: "seed",
  },
];

export const ALL_MOODS = ["calm", "lonely", "hopeful", "alive", "soft", "homesick", "focus", "warm"] as const;

export const moodGradient: Record<string, string> = {
  soft: "from-primary/40 to-primary/10",
  alive: "from-warm to-warm/30",
  hopeful: "from-warm/60 to-primary/30",
  lonely: "from-primary/60 to-background",
  calm: "from-primary/30 to-background",
  homesick: "from-warm/40 to-primary/40",
  focus: "from-primary/50 to-primary/10",
  warm: "from-warm to-primary/40",
};
