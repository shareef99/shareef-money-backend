import { eq } from "drizzle-orm";
import app from "../../app.ts";
import { db } from "../../db/index.ts";
import { validateParamsId } from "../../middlewares/validators.ts";
import { categoryTable } from "./schema.ts";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { createCategorySchema } from "./validators.ts";

export const categoryRouter = app.basePath("/categories");

categoryRouter.get("/", async (c) => {
  const categories = await db.query.categoryTable.findMany();

  return c.json({ categories });
});

categoryRouter.get("/:id", validateParamsId, async (c) => {
  const { id } = c.req.valid("param");
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.id, id),
  });

  if (!category) {
    throw new HTTPException(400, {
      message: "Invalid category id",
    });
  }

  return c.json({ category });
});

categoryRouter.post(
  "/",
  zValidator("json", createCategorySchema),
  async (c) => {
    const payload = c.req.valid("json");

    const [createdCategory] = await db
      .insert(categoryTable)
      .values(payload)
      .returning();

    return c.json({ category: createdCategory });
  }
);

categoryRouter.put(
  ":id",
  validateParamsId,
  zValidator("json", createCategorySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");

    const [updatedCategory] = await db
      .update(categoryTable)
      .set(payload)
      .where(eq(categoryTable.id, id))
      .returning();

    return c.json({ category: updatedCategory });
  }
);

categoryRouter.get("/user/:id", validateParamsId, async (c) => {
  const { id } = c.req.valid("param");

  const categories = await db.query.categoryTable.findMany({
    where: eq(categoryTable.user_id, id),
    with: {
      subcategories: true,
    },
  });

  return c.json({ categories });
});
