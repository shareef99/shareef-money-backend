import { eq } from "drizzle-orm";
import app from "../../app.ts";
import { db } from "../../db/index.ts";
import { validateParamsId } from "../../middlewares/validators.ts";
import { accountTable } from "./schema.ts";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { createAccountSchema, updateAccountSchema } from "./validators.ts";

export const accountRouter = app.basePath("/accounts");

accountRouter.get("/", async (c) => {
  const accounts = await db.query.accountTable.findMany();
  return c.json({ accounts });
});

accountRouter.get("/:id", validateParamsId, async (c) => {
  const { id } = c.req.valid("param");
  const account = await db.query.accountTable.findFirst({
    where: eq(accountTable.id, id),
  });

  if (!account) {
    throw new HTTPException(400, {
      message: "Invalid account id",
    });
  }

  return c.json({ account });
});

accountRouter.post("/", zValidator("json", createAccountSchema), async (c) => {
  const payload = c.req.valid("json");

  const [createdAccount] = await db
    .insert(accountTable)
    .values(payload)
    .returning();

  return c.json({ account: createdAccount });
});

accountRouter.put(
  ":id",
  validateParamsId,
  zValidator("json", updateAccountSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");

    const [updatedAccount] = await db
      .update(accountTable)
      .set(payload)
      .where(eq(accountTable.id, id))
      .returning();

    return c.json({ account: updatedAccount });
  }
);
