import type { LyricType } from "../types";
import type { ResponseSong } from "../types/Genius/music";
import { writable } from "svelte/store";

export const audioLyrics = writable<LyricType[]>([]);

export const selectedLyrics = writable<LyricType[]>([])  

export const audioLyricsInfo = writable<ResponseSong>();

export const currentlySelecting = writable(false);