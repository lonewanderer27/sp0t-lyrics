import { audio } from "./http.service";

export const YoutubeServices = {
  async getAudio(url: string) {
    console.log("gettingAudio")
    const res = await audio.get(`/youtube?url=${url}`, {
      responseType: "blob",
    });
    if (res.data == undefined) {
      console.log("Error happened")
      throw new Error("Error happened");
    }
    const audioUrl = URL.createObjectURL(new Blob([res.data]));
    return {
      derived: audioUrl,
      server: null,
    };
  },
  async validURL(url: string) {
    const res = await audio.get(`/validURL?url=${url}`);
    return res.data;
  },
};
