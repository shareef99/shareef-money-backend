import app from "../../app.ts";
import { db } from "../../db/index.ts";

export const usersRouter = app.basePath("/users");

usersRouter.get("/", async (c) => {
  const users = await db.query.usersTable.findMany();

  return c.json({ users });
});
