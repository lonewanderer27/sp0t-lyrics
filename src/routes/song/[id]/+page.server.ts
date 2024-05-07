import { GeniusServices } from '$lib/services/genius.service.js'
import type {LoadEvent} from "@sveltejs/kit";

export async function load(e: LoadEvent) {
  const music_id = e.params.id
  const api_path = e.url.searchParams.get("url")+""
  const lyrics = await GeniusServices.getLyricsWithClass(api_path, "Lyrics__Container");
  const song = GeniusServices.getSong(Number(music_id));

  return {
    song,
    lyrics
  }
} 

