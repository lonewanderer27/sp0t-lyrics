import { audio } from "./http.service";

export const YoutubeServices = {
  async getAudio(url: string, urlOnly = false) {
    console.log("gettingAudio")

    // check if the user wants only the url
    // if so, return only the url
    if (urlOnly) {
      console.log("getting url only")
      const res = await audio.get(`/youtube?url=${url}&urlOnly=true`);
      console.log(res.data)
      return {
        url: res.data.url,
      }
    }

    // otherwise, return the audio
    const res = await audio.get(`/youtube?url=${url}`, {
      responseType: "blob",
    });
    if (res.data == undefined) {
      console.log("Error happened")
      throw new Error("Error happened");
    }
    
    const audioUrl = URL.createObjectURL(new Blob([res.data]));
    
    return {
      url: audioUrl,
    };
  },
  
  async validURL(url: string) {
    const res = await audio.get(`/validURL?url=${url}`);
    return res.data;
  },
};
