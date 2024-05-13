<script lang="ts">
    export let song;

    import {Navbar, NavbarBackLink, Page, Button} from 'konsta/svelte';
    import {audioLyricsInfo, selectedLyrics, audioLyrics} from '../../../stores/lyrics';
    import {goto} from '$app/navigation';
    import {page} from '$app/stores';
    import {Icon} from "svelte-ionicons";
    import html2canvas from "html2canvas";

    // execute this code when the page is loaded
    $: () => {
      // check if audioLyricsInfo is empty
      if (!$audioLyricsInfo) {
        console.log("audioLyricsInfo is empty")

        // attempt to populate it from what the server sent us
        $audioLyricsInfo = song.song;

        // set the current audio info to the info of this song
        (async () => {
            $audioLyricsInfo = await song.song;
        })();
      }

      // check if audioLyrics is empty
      if ($audioLyrics.length === 0) {
        console.log("audioLyrics is empty")

        // attempt to populate it from what the server sent us
        $audioLyrics = song.lyrics;
      }

      // check if selected lyrics is empty
      if ($selectedLyrics.length === 0) {
        

        // try to load the selected lyrics from the query parameter
        const lyrics = $page.url.searchParams.get('lyrics');

        // if the lyrics is not empty
        if (lyrics) {
          // set the selected lyrics to the lyrics from the query parameter
          $selectedLyrics = JSON.parse(lyrics);
        }
      }
    }

    const handleBack = () => {
        // save the song id from the url
        const id = $page.url.pathname.split('/')[2];

        // save all the query parameters
        let query = new URLSearchParams($page.url.searchParams.toString());

        // go back to the song page with the song id and the query parameters
        goto(`/lyrics/${id}?${query.toString()}`);
    };

    const getImage = async () => {
        const canvas = await html2canvas(document.getElementById("lyric-card-container")!, {
            proxy: "/api/proxy/image",
        })
        return canvas.toDataURL("image/png");
        // domtoimage.toSvg
    }

    const download = async () => {
        const fakeLink = window.document.createElement("a");
        fakeLink.style.display = "none";
        fakeLink.download = "screenshot.png";
        fakeLink.href = await getImage();
        document.body.appendChild(fakeLink);
        fakeLink.click();
        document.body.removeChild(fakeLink);
    }

</script>

<Page>
  <Navbar
          title="Share Lyrics"
          class="px-4"
  >
    <NavbarBackLink slot="left" onClick={handleBack}/>
    <Button slot="right" onClick={download}>
      <Icon name="download-outline"/>
    </Button>
  </Navbar>

  <div id="lyric-card-container" class="p-10 flex flex-col justify-center">
    <div id="lyric-card" class="lyric-card p-5 shadow-xl bg-base-100 rounded-xl">
      <div class="lyric-card-header flex ">
        <div class="lyric-card-image mr-4">
          <img src={$audioLyricsInfo.header_image_thumbnail_url}
               alt={$audioLyricsInfo.title} class="w-10 h-auto rounded-sm"/>
        </div>
        <div>
          <p class="lyric-card-title font-semibold truncate">{$audioLyricsInfo.title}</p>
          <p class="lyric-card-artist text-xs">{$audioLyricsInfo.artist_names}</p>
        </div>
      </div>
      <div class="lyric-card-body mt-5">
        {#each $selectedLyrics as lyric}
          <p class="lyric-card-line text-2xl font-bold my-2">
            {lyric.text}
          </p>
        {/each}
      </div>
    </div>
  </div>

  <div class="w-full flex justify-center">
    <div class="grid grid-cols-6 text-center">
      <button class="btn col-span-2 flex flex-col px-8 items-center">
        <Icon name="logo-facebook"/>
        <span>Story</span>
      </button>
      <button class="btn col-span-2 flex flex-col px-8 items-center">
        <Icon name="logo-twitter"/>
        <span>Tweet</span>
      </button>
      <button class="btn col-span-2 flex flex-col px-8 items-center">
        <Icon name="logo-instagram"/>
        <span>Story</span>
      </button>
    </div>
  </div>
</Page>