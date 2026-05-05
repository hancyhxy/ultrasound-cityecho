import { z } from "zod";

const PlaylistSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(60),
  songs: z.array(z.object({ song: z.string(), artist: z.string() })).default([]),
  moods: z.array(z.string()).default([]),
  locationId: z.string().optional(),
  createdAt: z.number(),
});

export type UserPlaylist = z.infer<typeof PlaylistSchema>;

const KEY = "ultrasound:playlists:v1";

const UserTraceSchema = z.object({
  id: z.string(),
  song: z.string().min(1),
  artist: z.string().min(1),
  place: z.string().min(1),
  locationId: z.string().optional(),
  note: z.string().min(1).max(140),
  mood: z.string().min(1),
  createdAt: z.number(),
  forSong: z.object({ song: z.string(), artist: z.string() }),
});

export type UserTrace = z.infer<typeof UserTraceSchema>;

const USER_TRACES_KEY = "ultrasound:user-traces:v1";

export function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getUserPlaylists(): UserPlaylist[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = z.array(PlaylistSchema).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function saveUserPlaylist(input: Omit<UserPlaylist, "id" | "createdAt"> & { id?: string }): UserPlaylist {
  const list = getUserPlaylists();
  const id = input.id ?? `up_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const next: UserPlaylist = PlaylistSchema.parse({
    id,
    name: input.name,
    songs: input.songs ?? [],
    moods: input.moods ?? [],
    locationId: input.locationId,
    createdAt: Date.now(),
  });
  const without = list.filter((p) => p.id !== id);
  const merged = [next, ...without];
  if (isBrowser()) window.localStorage.setItem(KEY, JSON.stringify(merged));
  return next;
}

export function deleteUserPlaylist(id: string) {
  const next = getUserPlaylists().filter((p) => p.id !== id);
  if (isBrowser()) window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function addSongToPlaylist(playlistId: string, song: { song: string; artist: string }) {
  const list = getUserPlaylists();
  const target = list.find((p) => p.id === playlistId);
  if (!target) return;
  const exists = target.songs.some((s) => s.song === song.song && s.artist === song.artist);
  if (exists) return;
  const updated: UserPlaylist = { ...target, songs: [...target.songs, song] };
  const next = list.map((p) => (p.id === playlistId ? updated : p));
  if (isBrowser()) window.localStorage.setItem(KEY, JSON.stringify(next));
}

/* ─────────────────────────────────────────────────
   User-authored traces (the "write" side of the chorus)
   ───────────────────────────────────────────────── */

export function getUserTraces(): UserTrace[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(USER_TRACES_KEY);
    if (!raw) return [];
    const parsed = z.array(UserTraceSchema).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function saveUserTrace(input: Omit<UserTrace, "id" | "createdAt">): UserTrace {
  const id = `ut_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const next: UserTrace = UserTraceSchema.parse({
    ...input,
    id,
    createdAt: Date.now(),
  });
  const list = [next, ...getUserTraces()];
  if (isBrowser()) window.localStorage.setItem(USER_TRACES_KEY, JSON.stringify(list));
  return next;
}
