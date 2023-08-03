import { GeniusServices } from '$lib/services/genius.service.js'

export async function load(e) {
  const music_id = e.params.id
  const api_path = e.url.searchParams.get("url")+""
  const lyrics = await GeniusServices.getLyrics(api_path);
  const song = GeniusServices.getSong(Number(music_id));

  return {
    song,
    lyrics
  }
} 

