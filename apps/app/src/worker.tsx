import { get_date_time_now } from "@mono/utils";
import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { Document } from "./app/Document";

export default defineApp([
  render(Document, [
    route("/", () => new Response(`/ [Document]`)),
    route("/ping", function ({ request }) {
      return (
        <>
          <p>{get_date_time_now()}</p>
          <a href="/ping">Ping!</a>
          <a href="/pong">Pong!</a>
          <p>{request.url}</p>
        </>
      );
    }),
    route("/pong", function ({ request }) {
      return (
        <>
          <p>
            {get_date_time_now()}
          </p>
          <a href="/ping">Ping!</a>
          <a href="/pong">Pong!</a>
          <p>{request.url}</p>
        </>
      );
    }),
  ]),
  route("/", () => new Response(`/`)),
])
