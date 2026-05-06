import { getUserTraces, isBrowser, type UserTrace } from "./storage";
import { assetPath } from "./utils";

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
  /** Optional cover image the user attached to this trace.
      Distinct from the song's own cover — this is "the image this person
      paired with the song", airbuds/IG-story style. URL relative to /public. */
  userCover?: string;
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
    x: 20, y: 55,
    label: "UTS Library",
    count: 124, hot: true,
    mood: "Quiet, focused, late-afternoon",
    listening: 12,
    tags: ["focus", "calm", "instrumental"],
    songs: [
      { song: "晴天", artist: "周杰伦" },
      { song: "Love wins all", artist: "IU" },
      { song: "魔鬼中的天使", artist: "田馥甄" },
      { song: "披星戴月的想你", artist: "告五人" },
      { song: "Sunday Morning", artist: "The Velvet Underground" },
      { song: "White Ferrari", artist: "Frank Ocean" },
      { song: "Anti-Hero", artist: "Taylor Swift" },
      { song: "Lavender Haze", artist: "Taylor Swift" },
      { song: "Ivy", artist: "Frank Ocean" },
      { song: "Ribs", artist: "Lorde" },
    ],
  },
  {
    id: "central",
    x: 40, y: 45,
    label: "Central Stn",
    count: 78,
    mood: "Rushed mornings, slow evenings",
    listening: 23,
    tags: ["commute", "drive", "indie"],
    songs: [
      { song: "Motion Picture Soundtrack", artist: "Radiohead" },
      { song: "夜に駆ける", artist: "YOASOBI" },
      { song: "Love wins all", artist: "IU" },
      { song: "Self Control", artist: "Frank Ocean" },
      { song: "Lover, You Should've Come Over", artist: "Jeff Buckley" },
      { song: "Anti-Hero", artist: "Taylor Swift" },
      { song: "Ribs", artist: "Lorde" },
      { song: "What Was That", artist: "Lorde" },
      { song: "I Know the End", artist: "Phoebe Bridgers" },
      { song: "Pyramids", artist: "Frank Ocean" },
    ],
  },
  {
    id: "strand",
    x: 60, y: 27,
    label: "Strand Arcade",
    count: 31,
    mood: "Wandering, golden hour",
    listening: 4,
    tags: ["soft", "vintage", "wander"],
    songs: [
      { song: "Sunday Morning", artist: "The Velvet Underground" },
      { song: "Fortnight", artist: "Taylor Swift" },
      { song: "Solar Power", artist: "Lorde" },
      { song: "Espresso", artist: "Sabrina Carpenter" },
      { song: "Super Shy", artist: "NewJeans" },
      { song: "Please Please Please", artist: "Sabrina Carpenter" },
      { song: "Lavender Haze", artist: "Taylor Swift" },
      { song: "Baby Powder", artist: "Jenevieve" },
      { song: "Ivy", artist: "Frank Ocean" },
      { song: "魔鬼中的天使", artist: "田馥甄" },
    ],
  },
  {
    id: "glebe",
    x: 10, y: 50,
    label: "Glebe café",
    count: 56,
    mood: "First-coffee thoughts",
    listening: 8,
    tags: ["acoustic", "warm", "morning"],
    songs: [
      { song: "魔鬼中的天使", artist: "田馥甄" },
      { song: "Love wins all", artist: "IU" },
      { song: "Sunday Morning", artist: "The Velvet Underground" },
      { song: "Espresso", artist: "Sabrina Carpenter" },
      { song: "Solar Power", artist: "Lorde" },
      { song: "Baby Powder", artist: "Jenevieve" },
      { song: "Ivy", artist: "Frank Ocean" },
      { song: "晴天", artist: "周杰伦" },
      { song: "Lavender Haze", artist: "Taylor Swift" },
      { song: "Fortnight", artist: "Taylor Swift" },
    ],
  },
  {
    id: "wynyard",
    x: 57, y: 17,
    label: "Wynyard",
    count: 92, hot: true,
    mood: "The line wants to go home softly",
    listening: 18,
    tags: ["home", "soft", "tunnel"],
    songs: [
      { song: "Ribs", artist: "Lorde" },
      { song: "披星戴月的想你", artist: "告五人" },
      { song: "Lover, You Should've Come Over", artist: "Jeff Buckley" },
      { song: "夜に駆ける", artist: "YOASOBI" },
      { song: "Love wins all", artist: "IU" },
      { song: "Self Control", artist: "Frank Ocean" },
      { song: "I Know the End", artist: "Phoebe Bridgers" },
      { song: "What Was That", artist: "Lorde" },
      { song: "Green Light", artist: "Lorde" },
      { song: "White Ferrari", artist: "Frank Ocean" },
    ],
  },
  {
    id: "broadway",
    x: 33, y: 45,
    label: "Broadway gym",
    count: 19,
    mood: "Suffering, together",
    listening: 6,
    tags: ["energy", "loud", "alive"],
    songs: [
      { song: "DAMN.", artist: "Kendrick Lamar" },
      { song: "Mantra", artist: "Jennie" },
      { song: "Rockstar", artist: "Lisa" },
      { song: "Supernova", artist: "aespa" },
      { song: "Super Shy", artist: "NewJeans" },
      { song: "Green Light", artist: "Lorde" },
      { song: "I Know the End", artist: "Phoebe Bridgers" },
      { song: "夜に駆ける", artist: "YOASOBI" },
      { song: "Anti-Hero", artist: "Taylor Swift" },
      { song: "Espresso", artist: "Sabrina Carpenter" },
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
    song: "Love wins all",
    artist: "IU",
    place: "UTS Library · L7",
    locationId: "uts",
    note: "first all-nighter. somehow felt like everyone here was awake with me.",
    mood: "alive",
    time: "5h",
    unread: true,
    forSong: { song: "Love wins all", artist: "IU" },
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
    userCover: "/covers/blonde.jpeg",
  },
  {
    id: "t4",
    userId: "ash",
    userInitial: "A",
    userColor: "#7AC9C6",
    song: "DAMN.",
    artist: "Kendrick Lamar",
    place: "Fitness First Broadway",
    locationId: "broadway",
    note: "leg day. nobody talks here either but at least we're suffering together.",
    mood: "alive",
    time: "1d",
    forSong: { song: "DAMN.", artist: "Kendrick Lamar" },
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
    song: "魔鬼中的天使",
    artist: "田馥甄",
    place: "Glebe café",
    locationId: "glebe",
    note: "rain on the window. coffee got cold. didn't mind.",
    mood: "soft",
    time: "3d",
    forSong: { song: "魔鬼中的天使", artist: "田馥甄" },
  },
  {
    id: "t7",
    userId: "leo",
    userInitial: "L",
    userColor: "#C49EFF",
    song: "Love wins all",
    artist: "IU",
    place: "UTS Library · L5",
    locationId: "uts",
    note: "thesis at 2am. this song held me upright.",
    mood: "calm",
    time: "4d",
    forSong: { song: "Love wins all", artist: "IU" },
  },
  {
    id: "t8",
    userId: "mei",
    userInitial: "M",
    userColor: "#F5C26B",
    song: "晴天",
    artist: "周杰伦",
    place: "UTS Library · L5",
    locationId: "uts",
    note: "third night in Sydney. fell asleep at this desk. woke up still humming this in Mandarin like nothing had changed.",
    mood: "calm",
    time: "6w",
    forSong: { song: "晴天", artist: "周杰伦" },
  },
  {
    id: "t9",
    userId: "noa",
    userInitial: "N",
    userColor: "#E89F71",
    song: "Love wins all",
    artist: "IU",
    place: "UTS Library · L7",
    locationId: "uts",
    note: "rain outside. perfect for thesis writing.",
    mood: "soft",
    time: "8h",
    forSong: { song: "Love wins all", artist: "IU" },
  },
  {
    id: "t10",
    userId: "iris",
    userInitial: "I",
    userColor: "#A8C5FF",
    song: "Sunday Morning",
    artist: "The Velvet Underground",
    place: "Strand Arcade · ground floor",
    locationId: "strand",
    note: "the light through the glass roof felt like a hug.",
    mood: "soft",
    time: "3h",
    forSong: { song: "Sunday Morning", artist: "The Velvet Underground" },
    userCover: "/covers/ttpd.png",
  },
  {
    id: "t11",
    userId: "theo",
    userInitial: "T",
    userColor: "#FFB199",
    song: "Sunday Morning",
    artist: "The Velvet Underground",
    place: "Single O · Surry Hills",
    note: "stayed for a second flat white. didn't want to leave.",
    mood: "hopeful",
    time: "1d",
    forSong: { song: "Sunday Morning", artist: "The Velvet Underground" },
    userCover: "/covers/ruby.png",
  },
  {
    id: "t12",
    userId: "june",
    userInitial: "J",
    userColor: "#C9A8FF",
    song: "Sunday Morning",
    artist: "The Velvet Underground",
    place: "QVB · west window",
    note: "first sunday alone in this city. it was kind to me.",
    mood: "calm",
    time: "2d",
    forSong: { song: "Sunday Morning", artist: "The Velvet Underground" },
    userCover: "/covers/punisher.png",
  },
  {
    id: "t13",
    userId: "esme",
    userInitial: "E",
    userColor: "#9FE0CF",
    song: "Sunday Morning",
    artist: "The Velvet Underground",
    place: "Strand Arcade · top café",
    locationId: "strand",
    note: "wrote a letter I won't send. the song made me brave.",
    mood: "hopeful",
    time: "4d",
    forSong: { song: "Sunday Morning", artist: "The Velvet Underground" },
    userCover: "/covers/blonde.jpeg",
  },
  {
    id: "t14",
    userId: "mira",
    userInitial: "M",
    userColor: "#D8C4B6",
    song: "Fortnight",
    artist: "Taylor Swift",
    place: "Strand Arcade · top floor",
    locationId: "strand",
    note: "all my friends are calling and i'm letting it ring.",
    mood: "soft",
    time: "12h",
    forSong: { song: "Fortnight", artist: "Taylor Swift" },
  },
  {
    id: "t15",
    userId: "zoe",
    userInitial: "Z",
    userColor: "#F0A8A8",
    song: "Mantra",
    artist: "Jennie",
    place: "Fitness First Broadway",
    locationId: "broadway",
    note: "treadmill at 7am. she said it for me.",
    mood: "alive",
    time: "2d",
    forSong: { song: "Mantra", artist: "Jennie" },
  },
  {
    id: "t16",
    userId: "sol",
    userInitial: "S",
    userColor: "#E0D8C8",
    song: "Self Control",
    artist: "Frank Ocean",
    place: "Wynyard platform 3",
    locationId: "wynyard",
    note: "the train pulled up and i didn't get on.",
    mood: "lonely",
    time: "5d",
    forSong: { song: "Self Control", artist: "Frank Ocean" },
  },
  {
    id: "t17",
    userId: "vik",
    userInitial: "V",
    userColor: "#B8A8E0",
    song: "I Know the End",
    artist: "Phoebe Bridgers",
    place: "Wynyard platform 3",
    locationId: "wynyard",
    note: "screamed into a tunnel at midnight. felt better than i should.",
    mood: "alive",
    time: "1w",
    forSong: { song: "I Know the End", artist: "Phoebe Bridgers" },
  },

  // ── Strand Arcade fill (golden hour, soft, vintage) — to ~10 traces ──
  {
    id: "t18", userId: "rae", userInitial: "R", userColor: "#FFC8B0",
    song: "Solar Power", artist: "Lorde",
    place: "Strand Arcade · skylight",
    locationId: "strand",
    note: "the sun came in sideways and i forgot what i came for.",
    mood: "warm", time: "6h",
    forSong: { song: "Solar Power", artist: "Lorde" },
  },
  {
    id: "t19", userId: "kit", userInitial: "K", userColor: "#E0B8C8",
    song: "Espresso", artist: "Sabrina Carpenter",
    place: "Strand Arcade · top café",
    locationId: "strand",
    note: "two flat whites later, still humming this in my head.",
    mood: "hopeful", time: "11h",
    forSong: { song: "Espresso", artist: "Sabrina Carpenter" },
  },
  {
    id: "t20", userId: "ami", userInitial: "A", userColor: "#C8A8E0",
    song: "Lavender Haze", artist: "Taylor Swift",
    place: "Strand Arcade · jewellery row",
    locationId: "strand",
    note: "tried on a ring i won't buy. felt expensive for a moment.",
    mood: "soft", time: "2d",
    forSong: { song: "Lavender Haze", artist: "Taylor Swift" },
  },
  {
    id: "t21", userId: "bea", userInitial: "B", userColor: "#FFB098",
    song: "Baby Powder", artist: "Jenevieve",
    place: "Strand Arcade · ground floor",
    locationId: "strand",
    note: "perfume sample on my wrist. somehow it suited the song.",
    mood: "soft", time: "3d",
    forSong: { song: "Baby Powder", artist: "Jenevieve" },
  },
  {
    id: "t22", userId: "min", userInitial: "M", userColor: "#D8D0B8",
    song: "Ivy", artist: "Frank Ocean",
    place: "Strand Arcade · mezzanine",
    locationId: "strand",
    note: "saw an old couple slow-dancing in a shop window. didn't move for a while.",
    mood: "soft", time: "5d",
    forSong: { song: "Ivy", artist: "Frank Ocean" },
  },
  {
    id: "t23", userId: "ola", userInitial: "O", userColor: "#FFD0A8",
    song: "晴天", artist: "周杰伦",
    place: "Strand Arcade · bookstore corner",
    locationId: "strand",
    note: "found a chinese poetry book i couldn't read. bought it anyway.",
    mood: "calm", time: "1w",
    forSong: { song: "晴天", artist: "周杰伦" },
  },

  // ── Glebe café fill (acoustic, warm, morning) — to ~10 traces ──
  {
    id: "t24", userId: "ren", userInitial: "R", userColor: "#FF8A9B",
    song: "Love wins all", artist: "IU",
    place: "Glebe café · window seat",
    locationId: "glebe",
    note: "owner's dog fell asleep on my foot. didn't move for an hour.",
    mood: "soft", time: "5h",
    forSong: { song: "Love wins all", artist: "IU" },
  },
  {
    id: "t25", userId: "ivy", userInitial: "I", userColor: "#A8C5FF",
    song: "Sunday Morning", artist: "The Velvet Underground",
    place: "Glebe café",
    locationId: "glebe",
    note: "first day of autumn. the cup felt warmer than it was.",
    mood: "soft", time: "1d",
    forSong: { song: "Sunday Morning", artist: "The Velvet Underground" },
  },
  {
    id: "t26", userId: "kai", userInitial: "K", userColor: "#B68CFF",
    song: "Espresso", artist: "Sabrina Carpenter",
    place: "Glebe café · counter",
    locationId: "glebe",
    note: "ordered the wrong thing twice. the barista laughed.",
    mood: "hopeful", time: "2d",
    forSong: { song: "Espresso", artist: "Sabrina Carpenter" },
  },
  {
    id: "t27", userId: "tao", userInitial: "T", userColor: "#FFB199",
    song: "晴天", artist: "周杰伦",
    place: "Glebe café · back garden",
    locationId: "glebe",
    note: "the rain stopped right when this came on. coincidence felt like a friend.",
    mood: "calm", time: "3d",
    forSong: { song: "晴天", artist: "周杰伦" },
  },
  {
    id: "t28", userId: "ila", userInitial: "I", userColor: "#9DD17A",
    song: "Lavender Haze", artist: "Taylor Swift",
    place: "Glebe café",
    locationId: "glebe",
    note: "wrote three pages of nothing. didn't delete any of them.",
    mood: "soft", time: "4d",
    forSong: { song: "Lavender Haze", artist: "Taylor Swift" },
  },
  {
    id: "t29", userId: "san", userInitial: "S", userColor: "#9FE0CF",
    song: "Baby Powder", artist: "Jenevieve",
    place: "Glebe café",
    locationId: "glebe",
    note: "a stranger asked me what i was reading. it was a menu.",
    mood: "warm", time: "5d",
    forSong: { song: "Baby Powder", artist: "Jenevieve" },
  },
  {
    id: "t30", userId: "lou", userInitial: "L", userColor: "#C49EFF",
    song: "Solar Power", artist: "Lorde",
    place: "Glebe café · sidewalk",
    locationId: "glebe",
    note: "watched a kid run barefoot down the street. wanted to too.",
    mood: "hopeful", time: "1w",
    forSong: { song: "Solar Power", artist: "Lorde" },
  },

  // ── Broadway gym fill (energy, alive) — to ~10 traces ──
  {
    id: "t31", userId: "max", userInitial: "M", userColor: "#FFA0A0",
    song: "Rockstar", artist: "Lisa",
    place: "Fitness First Broadway",
    locationId: "broadway",
    note: "deadlift PR. screamed in my head, smiled with my mouth.",
    mood: "alive", time: "4h",
    forSong: { song: "Rockstar", artist: "Lisa" },
  },
  {
    id: "t32", userId: "neo", userInitial: "N", userColor: "#FFC0A0",
    song: "Green Light", artist: "Lorde",
    place: "Fitness First Broadway · cardio",
    locationId: "broadway",
    note: "treadmill at incline. pretended i was running toward something.",
    mood: "alive", time: "8h",
    forSong: { song: "Green Light", artist: "Lorde" },
  },
  {
    id: "t33", userId: "zia", userInitial: "Z", userColor: "#FF9090",
    song: "I Know the End", artist: "Phoebe Bridgers",
    place: "Fitness First Broadway · stretch zone",
    locationId: "broadway",
    note: "last set of the day. let the chorus carry me through.",
    mood: "alive", time: "1d",
    forSong: { song: "I Know the End", artist: "Phoebe Bridgers" },
  },
  {
    id: "t34", userId: "rio", userInitial: "R", userColor: "#FFB880",
    song: "夜に駆ける", artist: "YOASOBI",
    place: "Fitness First Broadway",
    locationId: "broadway",
    note: "ran faster than i thought i could. the song got me there.",
    mood: "alive", time: "2d",
    forSong: { song: "夜に駆ける", artist: "YOASOBI" },
  },
  {
    id: "t35", userId: "sam", userInitial: "S", userColor: "#FFA8C8",
    song: "Anti-Hero", artist: "Taylor Swift",
    place: "Fitness First Broadway · locker room",
    locationId: "broadway",
    note: "looked in the mirror after the workout. wasn't mean to myself for once.",
    mood: "soft", time: "3d",
    forSong: { song: "Anti-Hero", artist: "Taylor Swift" },
  },
  {
    id: "t36", userId: "tia", userInitial: "T", userColor: "#FFC4D0",
    song: "Espresso", artist: "Sabrina Carpenter",
    place: "Fitness First Broadway",
    locationId: "broadway",
    note: "5am class. somehow this song made it feel reasonable.",
    mood: "alive", time: "5d",
    forSong: { song: "Espresso", artist: "Sabrina Carpenter" },
  },
  {
    id: "t37", userId: "yui", userInitial: "Y", userColor: "#9DD17A",
    song: "Pyramids", artist: "Frank Ocean",
    place: "Fitness First Broadway",
    locationId: "broadway",
    note: "ten minute song, ten minute plank. didn't make it but tried.",
    mood: "alive", time: "1w",
    forSong: { song: "Pyramids", artist: "Frank Ocean" },
  },

  // ── Central Stn fill (commute, drive, indie) — to ~10 traces ──
  {
    id: "t38", userId: "gus", userInitial: "G", userColor: "#A0B0C8",
    song: "Self Control", artist: "Frank Ocean",
    place: "Central · platform 16",
    locationId: "central",
    note: "missed the 6:42 on purpose. needed the song to finish.",
    mood: "lonely", time: "3h",
    forSong: { song: "Self Control", artist: "Frank Ocean" },
  },
  {
    id: "t39", userId: "ian", userInitial: "I", userColor: "#B0C8E0",
    song: "Ribs", artist: "Lorde",
    place: "Central · concourse",
    locationId: "central",
    note: "saw my old high school friend on the opposite escalator. didn't wave.",
    mood: "lonely", time: "12h",
    forSong: { song: "Ribs", artist: "Lorde" },
  },
  {
    id: "t40", userId: "lia", userInitial: "L", userColor: "#A8C8D8",
    song: "What Was That", artist: "Lorde",
    place: "Central · grand concourse",
    locationId: "central",
    note: "my year just hit me on the steps. stood still for a minute.",
    mood: "soft", time: "1d",
    forSong: { song: "What Was That", artist: "Lorde" },
  },
  {
    id: "t41", userId: "uma", userInitial: "U", userColor: "#C8B8E0",
    song: "Love wins all", artist: "IU",
    place: "Central · platform 25",
    locationId: "central",
    note: "the express to the coast. felt like leaving without leaving.",
    mood: "calm", time: "2d",
    forSong: { song: "Love wins all", artist: "IU" },
  },
  {
    id: "t42", userId: "leo", userInitial: "L", userColor: "#C49EFF",
    song: "Lover, You Should've Come Over", artist: "Jeff Buckley",
    place: "Central · clock tower",
    locationId: "central",
    note: "10:47pm. nobody i was waiting for showed up.",
    mood: "lonely", time: "4d",
    forSong: { song: "Lover, You Should've Come Over", artist: "Jeff Buckley" },
  },
  {
    id: "t43", userId: "sky", userInitial: "S", userColor: "#B8D0E8",
    song: "Anti-Hero", artist: "Taylor Swift",
    place: "Central · 7-eleven outside",
    locationId: "central",
    note: "ate a sandwich on the curb at midnight. felt fine, actually.",
    mood: "soft", time: "5d",
    forSong: { song: "Anti-Hero", artist: "Taylor Swift" },
  },
  {
    id: "t44", userId: "fae", userInitial: "F", userColor: "#A0C0D0",
    song: "Pyramids", artist: "Frank Ocean",
    place: "Central · underground walkway",
    locationId: "central",
    note: "the whole song before my train came. the city held its breath with me.",
    mood: "soft", time: "1w",
    forSong: { song: "Pyramids", artist: "Frank Ocean" },
  },

  // ── UTS Library fill (focus, calm, instrumental) — top up to ~10 traces ──
  {
    id: "t45", userId: "wen", userInitial: "W", userColor: "#D0C8B0",
    song: "Sunday Morning", artist: "The Velvet Underground",
    place: "UTS Library · L4 atrium",
    locationId: "uts",
    note: "first quiet sunday in a month. the windows were perfect.",
    mood: "soft", time: "6h",
    forSong: { song: "Sunday Morning", artist: "The Velvet Underground" },
  },
  {
    id: "t46", userId: "han", userInitial: "H", userColor: "#C0D8B0",
    song: "晴天", artist: "周杰伦",
    place: "UTS Library · L6",
    locationId: "uts",
    note: "second-year homesick at 4pm. this fixed it for forty seconds.",
    mood: "homesick", time: "9h",
    forSong: { song: "晴天", artist: "周杰伦" },
  },
  {
    id: "t47", userId: "elo", userInitial: "E", userColor: "#B0C0D0",
    song: "魔鬼中的天使", artist: "田馥甄",
    place: "UTS Library · group study",
    locationId: "uts",
    note: "everyone left for dinner. i stayed, the song stayed.",
    mood: "calm", time: "1d",
    forSong: { song: "魔鬼中的天使", artist: "田馥甄" },
  },
  {
    id: "t48", userId: "dax", userInitial: "D", userColor: "#A8B8C8",
    song: "White Ferrari", artist: "Frank Ocean",
    place: "UTS Library · L7 corner",
    locationId: "uts",
    note: "couldn't write my essay. wrote a letter to no one instead.",
    mood: "soft", time: "2d",
    forSong: { song: "White Ferrari", artist: "Frank Ocean" },
  },
  {
    id: "t49", userId: "nia", userInitial: "N", userColor: "#C8B8D0",
    song: "Anti-Hero", artist: "Taylor Swift",
    place: "UTS Library · printers",
    locationId: "uts",
    note: "binding my thesis. realised i'd done a thing.",
    mood: "alive", time: "3d",
    forSong: { song: "Anti-Hero", artist: "Taylor Swift" },
  },

  // ── Wynyard fill — top up to ~10 traces ──
  {
    id: "t50", userId: "qin", userInitial: "Q", userColor: "#A0B0C0",
    song: "Green Light", artist: "Lorde",
    place: "Wynyard · escalator",
    locationId: "wynyard",
    note: "i thought i'd cry on this trip. didn't. that felt like progress.",
    mood: "alive", time: "5h",
    forSong: { song: "Green Light", artist: "Lorde" },
  },
  {
    id: "t51", userId: "ruo", userInitial: "R", userColor: "#B0A0C0",
    song: "What Was That", artist: "Lorde",
    place: "Wynyard platform 3",
    locationId: "wynyard",
    note: "told someone the truth on the platform. the train wouldn't come.",
    mood: "alive", time: "1d",
    forSong: { song: "What Was That", artist: "Lorde" },
  },
  {
    id: "t52", userId: "jia", userInitial: "J", userColor: "#C0A0B0",
    song: "White Ferrari", artist: "Frank Ocean",
    place: "Wynyard · last carriage",
    locationId: "wynyard",
    note: "looked out the window for the whole song. the harbour bridge waited for me.",
    mood: "soft", time: "3d",
    forSong: { song: "White Ferrari", artist: "Frank Ocean" },
  },
  {
    id: "t53", userId: "wen", userInitial: "W", userColor: "#D0C8B0",
    song: "Pyramids", artist: "Frank Ocean",
    place: "Wynyard · platform 4 tunnel",
    locationId: "wynyard",
    note: "ten minutes underground. the whole story unfolded.",
    mood: "soft", time: "5d",
    forSong: { song: "Pyramids", artist: "Frank Ocean" },
  },
];

for (const trace of FEED) {
  if (trace.userCover) trace.userCover = assetPath(trace.userCover);
}

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

/** All traces for a given location. Includes user-written traces (browser-only).
 *  Used by /playing STORY face when entering by location (not by song). */
export function findTracesForLocation(locationId: string | undefined): Trace[] {
  if (!locationId) return [];
  const fixtures = FEED.filter((t) => t.locationId === locationId);
  if (!isBrowser()) return fixtures;
  const mine = getUserTraces()
    .filter((ut) => ut.locationId === locationId)
    .map(userTraceToTrace);
  // Self traces float to the top so user sees their own contribution first.
  return [...mine, ...fixtures];
}

export const SEED_PLAYLISTS: SeedPlaylist[] = [
  {
    id: "sp1",
    name: "UTS Library · study self",
    count: 24,
    gradient: "from-primary to-accent/60",
    moods: ["calm", "focus"],
    locationId: "uts",
    source: "seed",
  },
  {
    id: "sp2",
    name: "Wynyard, going home",
    count: 18,
    gradient: "from-accent to-destructive/60",
    moods: ["soft", "homesick"],
    locationId: "wynyard",
    source: "seed",
  },
  {
    id: "sp3",
    name: "Single O mornings",
    count: 11,
    gradient: "from-accent/80 to-primary/70",
    moods: ["hopeful", "warm"],
    locationId: "strand",
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
  {
    id: "sp5",
    name: "Late nights, Wynyard",
    count: 7,
    gradient: "from-primary to-accent/40",
    moods: ["soft", "homesick"],
    locationId: "wynyard",
    source: "seed",
  },
  {
    id: "sp6",
    name: "Glebe rain hours",
    count: 3,
    gradient: "from-accent/60 to-primary/40",
    moods: ["soft", "warm"],
    locationId: "glebe",
    source: "seed",
  },
];

/* ─────────────────────────────────────────────────
   "Me" — the user as a stranger to themselves
   Hand-authored traces the user has left across the city.
   Used by /me to retell their year in story form.
   ───────────────────────────────────────────────── */

export type Season = "spring" | "summer" | "autumn" | "winter";

export type MyTrace = {
  id: string;
  song: string;
  artist: string;
  place: string;
  locationId?: string;
  note: string;
  mood: string;
  /** Hand-annotated season (Sydney / Southern Hemisphere). */
  season: Season;
  /** Hand-annotated narrative timestamp ("11:47pm, Tuesday"). */
  when: string;
  /** Order in user's history; lower = earlier. */
  order: number;
};

export const MY_TRACES: MyTrace[] = [
  {
    id: "m1",
    song: "晴天",
    artist: "周杰伦",
    place: "UTS Library · L5",
    locationId: "uts",
    note: "third night in this city. fell asleep at this desk. woke up still humming this in Mandarin like nothing had changed.",
    mood: "calm",
    season: "summer",
    when: "late January, around 2am",
    order: 1,
  },
  {
    id: "m2",
    song: "Love wins all",
    artist: "IU",
    place: "UTS Library · L7",
    locationId: "uts",
    note: "thesis at 2am. this song held me upright.",
    mood: "soft",
    season: "autumn",
    when: "11:47pm, Tuesday",
    order: 6,
  },
  {
    id: "m3",
    song: "Ribs",
    artist: "Lorde",
    place: "Wynyard platform 3",
    locationId: "wynyard",
    note: "the line wanted to go home softly. so did I.",
    mood: "homesick",
    season: "autumn",
    when: "9:12pm, going home",
    order: 5,
  },
  {
    id: "m4",
    song: "夜に駆ける",
    artist: "YOASOBI",
    place: "Wynyard platform 3",
    locationId: "wynyard",
    note: "missed my stop. didn't mind.",
    mood: "soft",
    season: "winter",
    when: "8:40pm, a Friday",
    order: 4,
  },
  {
    id: "m5",
    song: "魔鬼中的天使",
    artist: "田馥甄",
    place: "Glebe café",
    locationId: "glebe",
    note: "rain on the window. coffee got cold. didn't mind.",
    mood: "soft",
    season: "autumn",
    when: "Sunday morning",
    order: 7,
  },
  {
    id: "m6",
    song: "Sunday Morning",
    artist: "The Velvet Underground",
    place: "Single O, Surry Hills",
    note: "first warm morning in weeks. ordered the same thing twice.",
    mood: "hopeful",
    season: "spring",
    when: "early September, 9am",
    order: 2,
  },
  {
    id: "m7",
    song: "Love wins all",
    artist: "IU",
    place: "Wynyard platform 3",
    locationId: "wynyard",
    note: "everyone got off. I stayed for one more verse.",
    mood: "calm",
    season: "winter",
    when: "rainy Wednesday, 7pm",
    order: 3,
  },
  {
    id: "m8",
    song: "Sunday Morning",
    artist: "The Velvet Underground",
    place: "Strand Arcade",
    locationId: "strand",
    note: "golden hour caught me on the escalator. stood still for the whole song.",
    mood: "warm",
    season: "summer",
    when: "late afternoon, December",
    order: 8,
  },
];

/* ─────────────────────────────────────────────────
   Adapters: bridge UserTrace (storage) ↔ MyTrace / Trace (UI consumers)
   so user-written traces participate in the same narratives as fixtures.
   ───────────────────────────────────────────────── */

/** Sydney mapping (must match currentSeason() below). */
function seasonOf(date: Date): Season {
  const m = date.getMonth();
  if (m === 11 || m === 0 || m === 1) return "summer";
  if (m >= 2 && m <= 4) return "autumn";
  if (m >= 5 && m <= 7) return "winter";
  return "spring";
}

/** Convert a localStorage user trace into the MyTrace shape consumed by /me. */
export function userTraceToMyTrace(ut: UserTrace, indexAfterFixtures: number): MyTrace {
  const d = new Date(ut.createdAt);
  return {
    id: ut.id,
    song: ut.song,
    artist: ut.artist,
    place: ut.place,
    locationId: ut.locationId,
    note: ut.note,
    mood: ut.mood,
    season: seasonOf(d),
    when: relativeTime(ut.createdAt),
    // User traces always come AFTER hand-authored fixtures in narrative order.
    order: 100 + indexAfterFixtures,
  };
}

/** Convert a UserTrace into the Trace shape consumed by /traces feed and danmaku. */
export function userTraceToTrace(ut: UserTrace): Trace {
  return {
    id: ut.id,
    userId: "self",
    userInitial: "L",
    userColor: "#F5C26B", // amber — distinct from stranger palette
    song: ut.song,
    artist: ut.artist,
    place: ut.place,
    locationId: ut.locationId,
    note: ut.note,
    mood: ut.mood,
    time: relativeTime(ut.createdAt),
    forSong: ut.forSong,
  };
}

/** Tiny relative-time formatter. "just now" / "5m" / "2h" / "3d". */
export function relativeTime(ts: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

/**
 * Combined source of truth for "my" traces — fixtures floor + user-written.
 * SSR-safe: on the server, localStorage is unavailable so only fixtures are
 * returned; client-side hydration adds user traces. Consumers that need to
 * react to writes should depend on a state changed at write-time (e.g. the
 * pinnedTrace flag), not call this in render unconditionally.
 */
function allMyTraces(): MyTrace[] {
  if (!isBrowser()) return MY_TRACES;
  const userMine = getUserTraces().map((ut, i) => userTraceToMyTrace(ut, i));
  return [...MY_TRACES, ...userMine];
}

/** First trace by hand-annotated order. */
export function getMyFirstTrace(): MyTrace | undefined {
  return [...allMyTraces()].sort((a, b) => a.order - b.order)[0];
}

/** Place where the user has left the most traces (with at least one). */
export function getMyHomePlace(): { pin: Pin; tracesCount: number } | undefined {
  const counts = new Map<string, number>();
  for (const t of allMyTraces()) {
    if (!t.locationId) continue;
    counts.set(t.locationId, (counts.get(t.locationId) ?? 0) + 1);
  }
  let topId: string | undefined;
  let topCount = 0;
  for (const [id, n] of counts) {
    if (n > topCount) {
      topId = id;
      topCount = n;
    }
  }
  if (!topId) return undefined;
  const pin = PINS.find((p) => p.id === topId);
  return pin ? { pin, tracesCount: topCount } : undefined;
}

/** Year-in-review counters for the /me dashboard top row. All four are
    derived from the same allMyTraces() corpus so they stay coherent
    when user-written stories are added. */
export function getMyYearStats(): {
  stories: number;
  songs: number;
  places: number;
  strangers: number;
} {
  const all = allMyTraces();
  const songs = new Set(all.map((t) => `${t.song}::${t.artist}`));
  const places = new Set(all.map((t) => t.locationId).filter(Boolean));
  // "Strangers who wrote with you" = unique FEED userIds who wrote about
  // a song the user also wrote about.
  const myKeys = new Set(all.map((t) => `${t.song}::${t.artist}`));
  const strangers = new Set(
    FEED.filter((f) => myKeys.has(`${f.forSong.song}::${f.forSong.artist}`)).map((f) => f.userId)
  );
  return {
    stories: all.length,
    songs: songs.size,
    places: places.size,
    strangers: strangers.size,
  };
}

/** Top N songs by story count (how many times the user wrote about each
    song). Returned in descending order. */
export function getMyTopSongs(
  n: number
): { song: string; artist: string; storyCount: number }[] {
  const counts = new Map<string, { song: string; artist: string; storyCount: number }>();
  for (const t of allMyTraces()) {
    const key = `${t.song}::${t.artist}`;
    const cur = counts.get(key);
    if (cur) cur.storyCount += 1;
    else counts.set(key, { song: t.song, artist: t.artist, storyCount: 1 });
  }
  return [...counts.values()].sort((a, b) => b.storyCount - a.storyCount).slice(0, n);
}

/** Top N places by story count. Used to render a horizontal row of
    FourGridCover tiles for "places that knew your name". */
export function getMyTopPlaces(n: number): { pin: Pin; storyCount: number }[] {
  const counts = new Map<string, number>();
  for (const t of allMyTraces()) {
    if (!t.locationId) continue;
    counts.set(t.locationId, (counts.get(t.locationId) ?? 0) + 1);
  }
  const entries: { pin: Pin; storyCount: number }[] = [];
  for (const [id, storyCount] of counts) {
    const pin = PINS.find((p) => p.id === id);
    if (pin) entries.push({ pin, storyCount });
  }
  return entries.sort((a, b) => b.storyCount - a.storyCount).slice(0, n);
}

/**
 * The "you were not alone" pair: a song the user wrote for that a stranger
 * also wrote for. We pick the user's earliest such trace and the closest
 * stranger trace by hand-authored proximity (no real timestamp math).
 */
export function getStrangerTimeOverlap():
  | { mine: MyTrace; theirs: Trace; minutesApart: number }
  | undefined {
  for (const mine of [...MY_TRACES].sort((a, b) => a.order - b.order)) {
    const theirs = FEED.find(
      (t) => t.forSong.song === mine.song && t.forSong.artist === mine.artist
    );
    if (theirs) {
      // Hand-authored overlap minutes — narrative, not computed.
      // We pin a small "you and they were ~15 minutes apart" feel.
      return { mine, theirs, minutesApart: 15 };
    }
  }
  return undefined;
}

/** Group user traces by season (fixtures + user-written merged). */
export function getMyTracesBySeason(): Record<Season, MyTrace[]> {
  const out: Record<Season, MyTrace[]> = {
    spring: [],
    summer: [],
    autumn: [],
    winter: [],
  };
  for (const t of allMyTraces()) {
    out[t.season].push(t);
  }
  return out;
}

/** Sydney / Southern Hemisphere month → season. */
export function currentSeason(now: Date = new Date()): Season {
  const m = now.getMonth(); // 0-11
  if (m === 11 || m === 0 || m === 1) return "summer";
  if (m >= 2 && m <= 4) return "autumn";
  if (m >= 5 && m <= 7) return "winter";
  return "spring";
}

export const ALL_MOODS = ["calm", "lonely", "hopeful", "alive", "soft", "homesick", "focus", "warm"] as const;

export const moodGradient: Record<string, string> = {
  soft: "from-primary/40 to-primary/10",
  alive: "from-accent to-accent/30",
  hopeful: "from-accent/60 to-primary/30",
  lonely: "from-primary/60 to-background",
  calm: "from-primary/30 to-background",
  homesick: "from-accent/40 to-primary/40",
  focus: "from-primary/50 to-primary/10",
  warm: "from-accent to-primary/40",
};

// User avatar mock — deterministic mapping from userId to one of 8 real
// portrait files in /public/user_profile_img. Same userId always returns
// the same avatar across pages (story bubbles, danmaku, modals).
const USER_AVATAR_COUNT = 8;
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
export function getUserAvatar(userId: string): string {
  const idx = (hashStr(userId) % USER_AVATAR_COUNT) + 1;
  return assetPath(`/user_profile_img/user-${idx}.png`);
}
