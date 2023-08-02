<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import 'media-chrome';
  import { playingAudioURLStore, playingAudioInfoStore, isPlayingStore } from '../../stores/music';
	import { YoutubeServices } from '$lib/services/youtube.service';

  $: query = createQuery({
    queryKey: [$playingAudioURLStore],
    queryFn: async () => {
      console.log("fetching audio: ", $playingAudioURLStore)
      return await YoutubeServices.getAudio($playingAudioURLStore)
    },
    refetchOnWindowFocus: false,
    enabled: $playingAudioURLStore !== ""
  })
</script>

<div class="grid grid-cols-5 left-0 bottom-0 fixed justify-center w-full  backdrop-blur-xl my-0 px-3 py-2 z-50">
  <div class="col-span-1 flex justify-center">
    <img src={$playingAudioInfoStore.header_image_thumbnail_url} alt={'Home'} class="w-12 h-12 rounded-md" />
  </div>
  <div class="col-span-3">
    <p class="font-semibold truncate">{$playingAudioInfoStore.title}</p>
    <p>{$playingAudioInfoStore.artist_names}</p>
  </div>
  <div class="col-span-1">
    {#if $query.isLoading === true}
      <span class="loading loading-ring loading-md"/>
    {/if}

    {#if $query.isSuccess}
    <media-controller audio>
      <audio
        slot="media"
        src={$query?.data?.derived}
        autoplay
        on:pause={() => $isPlayingStore = false}
        on:playing={() => $isPlayingStore = true}
        on:click={e => e.stopPropagation()}
      />
      <media-control-bar>
        <media-play-button/>
      </media-control-bar>
    </media-controller>
    {/if}
  </div>
</div>