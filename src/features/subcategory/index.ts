import { eq } from "drizzle-orm";
import app from "../../app.ts";
import { db } from "../../db/index.ts";
import { validateParamsId } from "../../middlewares/validators.ts";
import { subcategoryTable } from "./schema.ts";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { createSubcategorySchema } from "./validators.ts";
import { authMiddleware } from "../../middlewares/auth.ts";

export const subcategoriesRouter = app.basePath("/subcategories");

subcategoriesRouter.get("/", authMiddleware, async (c) => {
  const subcategories = await db.query.subcategoryTable.findMany();

  return c.json({ subcategories });
});

subcategoriesRouter.get("/:id", authMiddleware, validateParamsId, async (c) => {
  const { id } = c.req.valid("param");
  const subcategory = await db.query.subcategoryTable.findFirst({
    where: eq(subcategoryTable.id, id),
  });

  if (!subcategory) {
    throw new HTTPException(400, {
      message: "Invalid subcategory id",
    });
  }

  return c.json({ subcategory });
});

subcategoriesRouter.post(
  "/",
  authMiddleware,
  zValidator("json", createSubcategorySchema),
  async (c) => {
    const payload = c.req.valid("json");

    const [createdSubcategory] = await db
      .insert(subcategoryTable)
      .values(payload)
      .returning();

    return c.json({ subcategory: createdSubcategory });
  }
);

subcategoriesRouter.put(
  ":id",
  authMiddleware,
  validateParamsId,
  zValidator("json", createSubcategorySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");

    const [updatedSubcategory] = await db
      .update(subcategoryTable)
      .set(payload)
      .where(eq(subcategoryTable.id, id))
      .returning();

    return c.json({ subcategory: updatedSubcategory });
  }
);

subcategoriesRouter.get(
  "/category/:id",
  authMiddleware,
  validateParamsId,
  async (c) => {
    const { id } = c.req.valid("param");

    const subcategories = await db.query.subcategoryTable.findMany({
      where: eq(subcategoryTable.category_id, id),
    });

    return c.json({ subcategories });
  }
);
