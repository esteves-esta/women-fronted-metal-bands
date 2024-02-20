import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

var corsOptions = {
  origin: ["http://localhost:5173", "https://esteves-esta.github.io"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(
  "/",
  createProxyMiddleware({
    target: "https://api.deezer.com/",
    changeOrigin: true,
  })
);

const server = app.listen(port, ()=> {
  console.log(`running in ${port}`)
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
