export interface EmoteData {
  id: string;
  name: string;
  url: string;
  animated?: boolean;
}

// Global Twitch Emotes
export const GLOBAL_EMOTES: EmoteData[] = [
  {
    id: "pogchamp",
    name: "PogChamp",
    url: "https://static-cdn.jtvnw.net/emoticons/v2/305954156/default/dark/3.0"
  },
  {
    id: "kappa",
    name: "Kappa",
    url: "https://static-cdn.jtvnw.net/emoticons/v2/25/default/dark/3.0"
  },
  {
    id: "lul",
    name: "LUL",
    url: "https://static-cdn.jtvnw.net/emoticons/v2/425618/default/dark/3.0"
  },
  {
    id: "biblethump",
    name: "BibleThump",
    url: "https://static-cdn.jtvnw.net/emoticons/v2/86/default/dark/3.0"
  }
];

// BTTV Emotes
export const BTTV_EMOTES: EmoteData[] = [
  {
    id: "monkas",
    name: "monkaS",
    url: "https://cdn.betterttv.net/emote/56e9f494fff3cc5c35e5287e/3x",
  },
  {
    id: "pepelaugh",
    name: "PepeLaugh",
    url: "https://cdn.betterttv.net/emote/5c548025009a2e73916b3a37/3x",
  },
  {
    id: "omegalul",
    name: "OMEGALUL",
    url: "https://cdn.betterttv.net/emote/583089f4737a8e61abb0186b/3x",
  },
  {
    id: "sadge",
    name: "Sadge",
    url: "https://cdn.betterttv.net/emote/5e0fa9d40550d42106b8a489/3x",
  }
];

// 7TV Emotes (some are animated)
export const SEVENTV_EMOTES: EmoteData[] = [
  {
    id: "catjam",
    name: "catJAM",
    url: "https://cdn.7tv.app/emote/60ae958e229664e8667aea38/4x.webp",
    animated: true
  },
  {
    id: "poggers",
    name: "POGGERS",
    url: "https://cdn.7tv.app/emote/60ae4e137e8706b27d695a4a/4x.webp"
  }
];

// Combine all emotes
export const ALL_EMOTES: EmoteData[] = [
  ...GLOBAL_EMOTES,
  ...BTTV_EMOTES,
  ...SEVENTV_EMOTES
];

// Create a map for quick lookups
export const EMOTE_MAP = new Map<string, EmoteData>(
  ALL_EMOTES.map(emote => [emote.name, emote])
); 