import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { Document } from "./app/Document";

export default defineApp([
  route("/", () => new Response(`root`)),
  render(Document, [
    route("/", () => new Response(`document root`)),
    route("/ping", function () {
      return <h1>Pong! </h1>;
    }),
  ]),
])
