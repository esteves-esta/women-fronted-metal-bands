import { DEEZER_API } from "../../constants";

export async function fetcher(endpoint) {
  const response = await fetch(`${DEEZER_API}chart${endpoint}`, {
    method: "GET",
    headers: {
      "X-API-KEY": import.meta.env.VITE_MY_API_KEY,
    },
  });

  const json = await response.json();
  if (json.error && json.error?.code === 500)
    throw new Error(json.error.message);
  return json;
}

export const errorRetry = (error, key, config, revalidate, { retryCount }) => {
  // console.log({ key, config });
  // Never retry on 404.
  if (error.status === 404 || error.status === 500) return;

  if (retryCount >= 2) return;

  // Retry after 5 seconds.
  setTimeout(() => revalidate({ retryCount }), 5000);
};
