import { json, type RequestHandler } from "@sveltejs/kit";
import ytdl from "ytdl-core";

export const GET: RequestHandler = async (event) => {
  const url = event.url.searchParams.get("url");

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
    console.log("Video info: ", info)
    
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

    // create a readable stream from the lowest audio format
    const audioStream = ytdl(url, {
      quality: "lowestaudio",
      filter: "audioonly"
    })

    // pipe the audio data into the response
    // audioStream.pipe(event)
    console.log(`Streaming: ${info.videoDetails.title}`)

    const stream = new ReadableStream({
      start(controller) {
        audioStream.on("data", (chunk: unknown) => {
          controller.enqueue(chunk)
        })
        audioStream.on("end", () => {
          controller.close()
        })
      }
    })

    return new Response(stream, {
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