/**
 * Song-level theme tokens — cover image + color palette per song.
 *
 * Each song that has bespoke artwork gets an entry here. The STORY face of
 * /playing pulls cover + theme tint from this table. When we eventually
 * extract palette from the cover image at runtime (ColorThief etc.), the
 * `tint` / `tintDeep` fields become computed; the table stays as the cover-
 * authority registry.
 *
 * Keys are `${song.toLowerCase()}::${artist.toLowerCase()}` to dedupe across
 * casing and to keep the lookup boundary explicit.
 *
 * Tint conventions:
 *  - `tint`     — mid-tone of the cover, used for chunky CTAs
 *  - `tintDeep` — darkest tone, used as bottom of page-gradient
 *  - `tintLight`— highlight tone, used for subtle accents (count text etc.)
 */

export type SongTheme = {
  cover: string;
  tint: string;
  tintDeep: string;
  tintLight: string;
  /** Song-specific prompt shown on the STORY face hero. Second-person, returns
      the listener to a moment, written to echo the song's lyric or mood. */
  prompt: string;
};

const THEMES: Record<string, SongTheme> = {
  // Strand Arcade — Sunday Morning. SZA SOS deep sea blue.
  "sunday morning::the velvet underground": {
    cover: "/songs/sunday-morning.jpg",
    tint: "#1f3a5c",
    tintDeep: "#0a1525",
    tintLight: "#c5d2e0",
    prompt: "Where did this song catch you?",
  },

  // Wynyard ⭐ — Ribs by Lorde. Pure Heroine black/white minimal.
  "ribs::lorde": {
    cover: "/covers/pure-heroine.png",
    tint: "#1a1a1a",
    tintDeep: "#000000",
    tintLight: "#e8e8e8",
    prompt: "Who were you before this song?",
  },

  // UTS Library ⭐ — 晴天 by 周杰伦. 叶惠美 vintage warm sepia/red.
  "晴天::周杰伦": {
    cover: "/covers/ye-hui-mei.jpg",
    tint: "#5c2818",
    tintDeep: "#1f0a05",
    tintLight: "#d4a878",
    prompt: "What does home sound like in another language?",
  },

  // Central — Motion Picture Soundtrack by Radiohead. Kid A red/black mountains.
  "motion picture soundtrack::radiohead": {
    cover: "/covers/kid-a.png",
    tint: "#5c1f1f",
    tintDeep: "#180808",
    tintLight: "#c8a880",
    prompt: "Where were you going when this came on?",
  },

  // UTS / Glebe / Wynyard — Love wins all by IU. The Winning EP red w/ blonde IU.
  "love wins all::iu": {
    cover: "/covers/iu-the-winning.png",
    tint: "#a02838",
    tintDeep: "#2a0814",
    tintLight: "#f0c0c8",
    prompt: "Who would you save first?",
  },

  // Glebe café / Strand — 魔鬼中的天使 by 田馥甄. Hebe Angel Devil cover.
  "魔鬼中的天使::田馥甄": {
    cover: "/covers/hebe-angel-devil.jpg",
    tint: "#3a2858",
    tintDeep: "#0a0418",
    tintLight: "#c8a8e0",
    prompt: "Who hurt you who you still defend?",
  },

  // Various — Super Shy by NewJeans. Get Up EP playful pastel blue.
  "super shy::newjeans": {
    cover: "/covers/newjeans-get-up.png",
    tint: "#5878a8",
    tintDeep: "#1a2438",
    tintLight: "#a8c8e8",
    prompt: "Who walked in and made you forget what you were saying?",
  },

  // Various city / Wynyard — 披星戴月的想你 by 告五人. Taiwan indie longing.
  "披星戴月的想你::告五人": {
    cover: "/covers/accusefive-stars.jpg",
    tint: "#2a3858",
    tintDeep: "#080812",
    tintLight: "#a8b8d8",
    prompt: "Who were you missing through the night?",
  },

  // Broadway / Strand — Supernova by aespa. Armageddon cyber-purple.
  "supernova::aespa": {
    cover: "/covers/aespa-armageddon.jpg",
    tint: "#5828a8",
    tintDeep: "#180420",
    tintLight: "#d0a8f0",
    prompt: "What were you trying to outrun?",
  },

  // Broadway gym — DAMN. by Kendrick Lamar. Blood red brick wall.
  "damn.::kendrick lamar": {
    cover: "/covers/damn.png",
    tint: "#a02020",
    tintDeep: "#2a0808",
    tintLight: "#f0c0b0",
    prompt: "What were you running from?",
  },

  // Wynyard alternate — 夜に駆ける by YOASOBI. Anime night-sky pink/purple.
  "夜に駆ける::yoasobi": {
    cover: "/covers/yoru-ni-kakeru.jpg",
    tint: "#3a2858",
    tintDeep: "#100820",
    tintLight: "#e8a8d0",
    prompt: "What kept you up that night?",
  },

  // Wynyard — Lover, You Should've Come Over by Jeff Buckley. Grace iridescent purple/teal.
  "lover, you should've come over::jeff buckley": {
    cover: "/covers/grace.jpg",
    tint: "#2a1f4a",
    tintDeep: "#080612",
    tintLight: "#a890d8",
    prompt: "Who didn't come?",
  },

  // Strand Arcade — Fortnight by Taylor Swift. TTPD black-and-white film.
  "fortnight::taylor swift": {
    cover: "/covers/ttpd.png",
    tint: "#3a3a3a",
    tintDeep: "#0a0a0a",
    tintLight: "#e0e0e0",
    prompt: "What were you letting ring?",
  },

  // Broadway gym — Mantra by Jennie. Ruby red curtain theatrical.
  "mantra::jennie": {
    cover: "/covers/ruby.png",
    tint: "#7a1820",
    tintDeep: "#1a0408",
    tintLight: "#f0a8a8",
    prompt: "What did you tell yourself, again?",
  },

  // Wynyard — Self Control by Frank Ocean. Blonde off-white shower portrait.
  "self control::frank ocean": {
    cover: "/covers/blonde.jpeg",
    tint: "#a89878",
    tintDeep: "#3a2f20",
    tintLight: "#f0e8d8",
    prompt: "What didn't you say?",
  },

  // Wynyard — I Know the End by Phoebe Bridgers. Punisher purple desert night.
  "i know the end::phoebe bridgers": {
    cover: "/covers/punisher.png",
    tint: "#3a2858",
    tintDeep: "#0a0418",
    tintLight: "#b8a8e0",
    prompt: "What did you scream into?",
  },

  // Frank Ocean — Pyramids. Channel Orange citrus orange.
  "pyramids::frank ocean": {
    cover: "/covers/channel-orange.jpg",
    tint: "#c45818",
    tintDeep: "#3a1808",
    tintLight: "#ffc890",
    prompt: "What story did you escape into tonight?",
  },

  // Frank Ocean — Ivy. Blonde shower-cool off-white.
  "ivy::frank ocean": {
    cover: "/covers/blonde.jpeg",
    tint: "#a89878",
    tintDeep: "#3a2f20",
    tintLight: "#f0e8d8",
    prompt: "Who did you used to be in love with?",
  },

  // Frank Ocean — White Ferrari. Blonde dreamy off-white.
  "white ferrari::frank ocean": {
    cover: "/covers/blonde.jpeg",
    tint: "#a89878",
    tintDeep: "#3a2f20",
    tintLight: "#f0e8d8",
    prompt: "Where did you wish you were going?",
  },

  // Taylor Swift — Anti-Hero. Midnights deep navy with white.
  "anti-hero::taylor swift": {
    cover: "/covers/midnights.png",
    tint: "#2a3858",
    tintDeep: "#0a1024",
    tintLight: "#d8d8e8",
    prompt: "What did you blame yourself for, this time?",
  },

  // Taylor Swift — Lavender Haze. Midnights — same album, dreamier prompt.
  "lavender haze::taylor swift": {
    cover: "/covers/midnights.png",
    tint: "#3a2858",
    tintDeep: "#0a1024",
    tintLight: "#d8c8e8",
    prompt: "Who couldn't see you the way she sees you?",
  },

  // Lisa — Rockstar. Alter Ego dark glam.
  "rockstar::lisa": {
    cover: "/covers/alter-ego.png",
    tint: "#1a1a1a",
    tintDeep: "#000000",
    tintLight: "#d8b878",
    prompt: "What did you wear when you wanted to be someone else?",
  },

  // Sabrina Carpenter — Espresso. Short n' Sweet pastel pink-blue.
  "espresso::sabrina carpenter": {
    cover: "/covers/short-n-sweet.png",
    tint: "#5878a8",
    tintDeep: "#1a2438",
    tintLight: "#f0c8d8",
    prompt: "Who was your morning that week?",
  },

  // Sabrina Carpenter — Please Please Please. Same album, more yearning.
  "please please please::sabrina carpenter": {
    cover: "/covers/short-n-sweet.png",
    tint: "#5878a8",
    tintDeep: "#1a2438",
    tintLight: "#f0c8d8",
    prompt: "What did you ask of someone you shouldn't have?",
  },

  // Jenevieve — Baby Powder. Cream/pearl indie R&B.
  "baby powder::jenevieve": {
    cover: "/covers/baby-powder.jpg",
    tint: "#a89878",
    tintDeep: "#2a2018",
    tintLight: "#f0e0c8",
    prompt: "Who were you trying to feel like?",
  },

  // Lorde — Green Light. Melodrama purple/violet party.
  "green light::lorde": {
    cover: "/covers/melodrama.png",
    tint: "#3a2868",
    tintDeep: "#0a0418",
    tintLight: "#b8a0d8",
    prompt: "What did you let go of, finally?",
  },

  // Lorde — Solar Power. Sunlit yellow beach.
  "solar power::lorde": {
    cover: "/covers/solar-power.png",
    tint: "#c8a838",
    tintDeep: "#3a2808",
    tintLight: "#fff0a8",
    prompt: "Where were you, the day you stopped checking your phone?",
  },

  // Lorde — What Was That. Virgin blue x-ray.
  "what was that::lorde": {
    cover: "/covers/virgin.png",
    tint: "#3868a8",
    tintDeep: "#0a1838",
    tintLight: "#a8c8e8",
    prompt: "What were you, before you said it out loud?",
  },
};

const FALLBACK: SongTheme = {
  cover: "",
  tint: "#3d2a55",
  tintDeep: "#1a1029",
  tintLight: "#c8b6e2",
  prompt: "What did this song hold?",
};

export function getSongTheme(song: string, artist: string): SongTheme {
  const key = `${song.toLowerCase()}::${artist.toLowerCase()}`;
  return THEMES[key] ?? FALLBACK;
}
