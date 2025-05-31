import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Master Shareef!");
});

Deno.serve(app.fetch);
