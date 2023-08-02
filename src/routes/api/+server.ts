import { json } from '@sveltejs/kit'

export const GET = (event) => {
  console.log(event)

  return json({
    message: 'Hello Svelte!'
  })
}