import "@std/dotenv/load";
import app from "./app.ts";
import env from "./env.ts";
import { userRouter } from "./features/users/index.ts";
import { categoryRouter } from "./features/category/index.ts";
import { subcategoriesRouter } from "./features/subcategory/index.ts";

const routes = [userRouter, categoryRouter, subcategoriesRouter];
routes.forEach((route) => app.route("/", route));

Deno.serve({ port: env.PORT }, app.fetch);
