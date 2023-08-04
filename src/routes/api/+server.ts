import {json, type RequestEvent} from '@sveltejs/kit'

export const GET = (event: RequestEvent) => {
  console.log(event)

  return json({
    message: 'Hello Svelte!'
  })
}