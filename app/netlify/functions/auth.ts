export function authAPI(req: Request) {
  const apiKey = Netlify.env.get("MY_API_KEY");
  const requestKey = req.headers.get("X-API-Key");

  if (requestKey !== apiKey) {
    return Response.json("Sorry, no access for you.", { status: 401 });
  }
}
