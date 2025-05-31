import "@std/dotenv/load";
import { Hono } from "hono";
import env from "./env.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Master Shareef!");
});

Deno.serve({ port: env.PORT }, app.fetch);
