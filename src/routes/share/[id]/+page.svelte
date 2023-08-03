<script lang="ts">
    import {Navbar, NavbarBackLink, Page} from 'konsta/svelte';
    import {audioLyricsInfo, selectedLyrics} from '../../../stores/lyrics';
    import {goto} from '$app/navigation';
    import { Icon } from "svelte-ionicons";

    const handleBack = () => {
        goto(`/lyrics/${$audioLyricsInfo.id}?url=${$audioLyricsInfo.url}`);
    };
</script>

<Page>
  <Navbar
          title="Share Lyrics"
          class="px-4"
  >
    <NavbarBackLink slot="left" onClick={handleBack}/>
  </Navbar>

  <div class="p-10 flex flex-col justify-center">
    <div class="lyric-card p-5 shadow-xl bg-base-100  rounded-xl">
      <div class="lyric-card-header grid grid-cols-5">
        <div class="lyric-card-image col-span-1">
          <img src={$audioLyricsInfo.header_image_thumbnail_url} alt={$audioLyricsInfo.title} class="w-10 h-auto"/>
        </div>
        <div class="col-span-4">
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