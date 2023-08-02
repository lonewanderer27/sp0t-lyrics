import { GeniusServices } from '$lib/services/genius.service.js'

export async function load(e) {
  const music_id = e.params.id
  const music = await GeniusServices.getSong(Number(music_id));
  const lyrics = await GeniusServices.getLyrics(music.derived.api_path);

  return {
    ...music,
    lyrics
  }
} 

