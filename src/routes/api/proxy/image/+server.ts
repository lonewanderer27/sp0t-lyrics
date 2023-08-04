import type {RequestEvent, RequestHandler} from '@sveltejs/kit';
import axios from "axios";

export const GET: RequestHandler = async (event: RequestEvent) => {
	const responseType = event.url.searchParams.get('responseType');
	const url = event.url.searchParams.get('url');
	switch (responseType) {
		case 'blob': {
			const image = await fetch(url!);
			return new Response(image.body);
		}
		case 'text':
		default: {
			const image = await axios.get(url!, {
				responseType: 'arraybuffer'
			});
			return new Response(image.data, {
				headers: {
					'content-type': image.headers['content-type']
				}
			});
		}
	}
};
