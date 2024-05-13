import * as cheerio from "cheerio";

import type { Result, SearchGenius } from "../../types/Genius/search"

import type { GeniusSong } from "../../types/Genius/music";
import type { LyricType } from "../../types";
import { genius } from "./http.service";
import jq from "$lib/jq"

export const GeniusServices = {
  async search(query: string) {
    const res = await genius.get<SearchGenius>(
      `/search?q=${query === "" ? "taylor swift" : query}`
    );
    const filter = jq.compile(
      '.. | .result? | select(.lyrics_state? == "complete")'
    );
    const songs: Result[] = [];
    for (const i of filter(res.data)) {
      songs.push(i);
    }
    console.log("songs: ", songs);
    return {
      server: res.data,
      songs: songs,
    };
  },
  async getSong(id: number) {
    const res = await genius.get<GeniusSong>(`/songs/${id}`);
    return {
      song: res.data.response.song,
    };
  },
  async getLyrics(url: string) {
    const res = await genius.get(`https://genius.com${url}`, {
      baseURL: "",
    });
    let $ = cheerio.load(res.data);
    const dataX = $(".Lyrics__Container-sc-1ynbvzw-1");
    const lyrics: LyricType[] = [];
    dataX.each((i, el) => {
      const dtx = $(el).html();
      $ = cheerio.load(dtx+"");
      $("br").replaceWith("\n");
      const XRT = $.text();
      const strings = XRT.split("\n");
      strings.forEach((str, i) => {
        lyrics.push({
          index: i,
          text: str,
          type: str.includes("[") ? "annotation" : "lyric",
        });
      });
    });
    return {
      lyrics,
    };
  },
  async getLyricsWithClass(url: string, className: string) {
    const res = await genius.get(`https://genius.com${url}`, {
      baseURL: "",
    });
    let $ = cheerio.load(res.data);
    const dataX = $(`[class^="${className}"]`);
    const lyrics: LyricType[] = [];
    let index = 0;
    dataX.each((i, el) => {
      const dtx = $(el).html();
      $ = cheerio.load(dtx+"");
      $("br").replaceWith("\n");
      const XRT = $.text();
      const strings = XRT.split("\n");
      strings.forEach((str, i) => {
        lyrics.push({
          index: index++, // increment index for each lyric
          text: str,
          type: str.includes("[") ? "annotation" : "lyric",
        });
      });
    });

    // console.log("lyrics: ", lyrics);
    console.log("lyrics: ", lyrics);

    return {
      lyrics,
    };
  },
};
