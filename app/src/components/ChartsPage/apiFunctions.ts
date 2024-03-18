export const BANDS_API = import.meta.env.DEV
  ? "http://localhost:8888/chart"
  : "https://women-fronted-metal-bands.netlify.app/chart";


export async function fetcher(endpoint) {
  const response = await fetch(`${BANDS_API}${endpoint}`, {
    method: "GET",
  });

  const json = await response.json();
  if (json.error && json.error?.code === 500)
    throw new Error(json.error.message);
  return json;
}

export const errorRetry = (error, key, config, revalidate, { retryCount }) => {
  // Never retry on 404.
  if (error.status === 404 || error.status === 500) return;

  if (retryCount >= 2) return;

  // Retry after 5 seconds.
  setTimeout(() => revalidate({ retryCount }), 5000);
};
