import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const apiKey = Netlify.env.get("MY_API_KEY");
  return new Response("Hello, world!" + apiKey);
};

export const config: Config = {
  path: "/hello",
};
