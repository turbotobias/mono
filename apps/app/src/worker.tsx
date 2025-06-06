import { test_a } from "@mono/a";
import { test_c } from "@mono/c";
import { HeeeySchema } from "@mono/utils";
import { render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { Document } from "./app/Document";

test_c()

export default defineApp([
  render(Document, [
    route("/", () => new Response(`@mono/a => test_a() => ${test_a()}\n@mono/utils => HeeeySchema.expects => ${HeeeySchema.expects}`)),
    route("/ping", function () {
      return <h1>Pong! </h1>;
    }),
  ]),
])
