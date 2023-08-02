import type { LyricType } from "../types";
import { writable } from "svelte/store";

export const selectedLyrics = writable<LyricType[]>([])  

export const currentlySelecting = writable(false);