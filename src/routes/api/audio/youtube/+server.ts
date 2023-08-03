import { json, type RequestHandler } from "@sveltejs/kit";
import ytdl from "ytdl-core";

export const GET: RequestHandler = async (event) => {
  const url = event.url.searchParams.get("url");
  const urlOnly = event.url.searchParams.get("urlOnly");

  // check if the user has passed url
  if (!url) {
    return json({
      status: 400,
      body: {
        message: "No url provided",
      },
    })
  }

  try {
    // check if the url is valid
    if (!ytdl.validateURL(url)) {
      console.log("Invalid YT URL: ", url)
      return json({
        status: 400,
        body: {
          message: "Invalid YT URL",
        },
      })
    }

    // get the video info from youtube
    const info = await ytdl.getInfo(url);
    
    // get audio formats
    const audioFormats = ytdl.filterFormats(info.formats, "audioonly");

    // if there are no audio formats, return error
    if (audioFormats.length === 0) {
      console.log("No audio formats found")
      return json({
        status: 400,
        body: {
          message: "No audio formats found",
        },
      })
    }
    
    // otherwise log the audio formats
    console.log("Audio formats: ", audioFormats)

    // if the user only wants the url, return it
    if (urlOnly) {
      console.log("Sent YT URL: ")
      console.log(audioFormats[0].url)
      return json({
        url: audioFormats[0].url,
      }, {
        headers: {
          'content-type': 'application/json'
        },
        status: 200,
        statusText: "OK"
      })
    }

    // create a readable stream from the lowest audio format
    const audioStream = ytdl(url, {
      quality: "lowestaudio",
      filter: "audioonly"
    })

    // pipe the audio data into the response
    // audioStream.pipe(event)
    console.log(`Streaming: ${info.videoDetails.title}`)

    return new Response(audioStream, {
      headers: {
        'content-type': 'audio/mpeg'
      }
    })
  } catch (err: unknown) {
    console.log("Error streaming video: ", err)
    return json({
      status: 500,
      body: {
        message: "Error streaming video",
      },
    })
  }
}