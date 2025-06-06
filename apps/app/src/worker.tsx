import { test_a } from "@mono/a";
import { HeeeySchema } from "@mono/utils";
import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { Document } from "./app/Document";

export default defineApp([
  route("/", () => new Response(`@mono/a => test_a() => ${test_a()}\n@mono/utils => HeeeySchema.expects => ${HeeeySchema.expects}`)),
  render(Document, [
    route("/", () => new Response(`@mono/a => test_a() => ${test_a()}\n@mono/utils => HeeeySchema.expects => ${HeeeySchema.expects}`)),
    route("/ping", function () {
      return <h1>Pong! </h1>;
    }),
  ]),
])
