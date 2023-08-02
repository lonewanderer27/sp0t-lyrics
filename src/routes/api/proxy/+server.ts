import axios, { type AxiosRequestConfig } from "axios";

import { json, type RequestHandler } from "@sveltejs/kit";
import Util from "$lib/util";

/** @type {import('./$types').RequestHandler} */
export const GET: RequestHandler = async (event) => {
  const endpoint = event.url.searchParams.get("endpoint")
  const headers = event.request.headers;

  // console.log("Endpoint: ", endpoint)
  // console.log("Headers: ", headers)

  // Check if endpoint is provided
  if (!endpoint || endpoint == "") {
    return new Response(JSON.stringify({
      message: 'No endpoint provided!'
    }), {
      status: 400
    })
  }

  // Check if endpoint is valid
  if (!Util.isValidURL(endpoint)) {
    return new Response(JSON.stringify({
      message: 'Invalid endpoint provided!'
    }), {
      status: 400
    })
  }

  // Check if we're going to genius.com
  // then check if we have the authorization header
  // since likely we require it
  if (!headers.get("authorization") && endpoint.includes("genius")) {
    return new Response(JSON.stringify({
      message: 'No authorization header provided!'
    }), {
      status: 400
    })
  }

  // Construct axios request config
  const reqConfig: AxiosRequestConfig = {
    url: endpoint as string,
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Authorization: headers.get("authorization") || "",
    },
    params: Util.filterProperties({ ...event.url.searchParams }, ["endpoint"]),
  };

  // Make request to endpoint
  const endpointResponse = await axios(reqConfig);

  // console.log('endpointResponse.data: ', endpointResponse.data)

  return json(endpointResponse.data, {
    status: endpointResponse.status,
    statusText: endpointResponse.statusText,
  })
}