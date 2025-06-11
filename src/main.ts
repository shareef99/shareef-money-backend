import "@std/dotenv/load";
import app from "./app.ts";
import env from "./env.ts";
import { userRouter } from "./features/users/index.ts";

const routes = [userRouter];
routes.forEach((route) => app.route("/", route));

Deno.serve({ port: env.PORT }, app.fetch);
