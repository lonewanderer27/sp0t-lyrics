import type { Result } from "../types/Genius/search";
import { writable } from "svelte/store";

export const playingAudioURLStore = writable("");

export const playingAudioInfoStore = writable<Result>();

export const isPlayingStore = writable(false);