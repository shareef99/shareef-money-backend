import { eq } from "drizzle-orm";
import app from "../../app.ts";
import { db } from "../../db/index.ts";
import { authMiddleware } from "../../middlewares/auth.ts";
import { validateParamsId } from "../../middlewares/validators.ts";
import { transactionsTable } from "./schema.ts";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "./validators.ts";
import { accountTable } from "../account/schema.ts";

export const transactionRouter = app.basePath("/transactions");

transactionRouter.get("/", authMiddleware, async (c) => {
  const transactions = await db.query.transactionsTable.findMany();
  return c.json({ transactions });
});

transactionRouter.get("/:id", authMiddleware, validateParamsId, async (c) => {
  const { id } = c.req.valid("param");
  const transaction = await db.query.transactionsTable.findFirst({
    where: eq(transactionsTable.id, id),
  });

  if (!transaction) {
    throw new HTTPException(400, {
      message: "Invalid transaction id",
    });
  }

  return c.json({ transaction });
});

transactionRouter.post(
  "/",
  authMiddleware,
  zValidator("json", createTransactionSchema),
  async (c) => {
    const payload = c.req.valid("json");

    const [createdTransaction] = await db
      .insert(transactionsTable)
      .values(payload)
      .returning();

    const account = await db.query.accountTable.findFirst({
      where: eq(accountTable.id, payload.account_id),
    });

    if (!account) {
      throw new HTTPException(400, {
        message: "Invalid account id",
      });
    }

    if (payload.type === "expense") {
      await db
        .update(accountTable)
        .set({ amount: account.amount - payload.amount })
        .where(eq(accountTable.id, payload.account_id));
    } else {
      await db
        .update(accountTable)
        .set({ amount: account.amount + payload.amount })
        .where(eq(accountTable.id, payload.account_id));
    }

    return c.json({ transaction: createdTransaction });
  }
);

transactionRouter.put(
  ":id",
  authMiddleware,
  validateParamsId,
  zValidator("json", updateTransactionSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");

    const [updatedTransaction] = await db
      .update(transactionsTable)
      .set(payload)
      .where(eq(transactionsTable.id, id))
      .returning();

    if (payload.amount) {
      if (!payload.prev_amount) {
        throw new HTTPException(400, {
          message: "`prev_amount` is required when `amount` is provided.",
        });
      }

      if (!payload.account_id) {
        throw new HTTPException(400, {
          message: "`account_id` is required when `amount` is provided.",
        });
      }

      if (!payload.type) {
        throw new HTTPException(400, {
          message: "`type` is required when `amount` is provided.",
        });
      }

      const account = await db.query.accountTable.findFirst({
        where: eq(accountTable.id, updatedTransaction.account_id),
      });

      if (!account) {
        throw new HTTPException(400, {
          message: "Invalid account id",
        });
      }

      if (payload.type === "expense") {
        await db
          .update(accountTable)
          .set({
            amount: account.amount + payload.prev_amount - payload.amount,
          })
          .where(eq(accountTable.id, updatedTransaction.account_id));
      } else {
        await db
          .update(accountTable)
          .set({
            amount: account.amount - payload.prev_amount + payload.amount,
          })
          .where(eq(accountTable.id, updatedTransaction.account_id));
      }
    }

    return c.json({ transaction: updatedTransaction });
  }
);
