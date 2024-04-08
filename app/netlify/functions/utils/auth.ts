export function authAPI(req: Request) {
  const apiKey = Netlify.env.get("VITE_MY_API_KEY");
  const requestKey = req.headers.get("X-API-KEY");

  // console.log({
  //   requestKey,
  //   apiKey,
  // });

  if (requestKey !== apiKey) {
    return { message: "Use not authenticated, if you want the website data you can get the data as an .csv from the website.", status: 401 };
  }
  return null;
}
