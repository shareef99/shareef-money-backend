import { zValidator } from "@hono/zod-validator";
import app from "../../app.ts";
import { db } from "../../db/index.ts";
import { loginSchema, updateUserSchema } from "./validators.ts";
import { eq } from "drizzle-orm";
import { userTable } from "./schema.ts";
import { TokenPayload } from "../../types/app.ts";
import { decode, sign, verify } from "hono/jwt";
import env from "../../env.ts";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { cookieKeys } from "../../constants/index.ts";
import { generateReferralCode } from "../../helpers/index.ts";
import { HTTPException } from "hono/http-exception";
import { authMiddleware } from "../../middlewares/auth.ts";
import { validateParamsId } from "../../middlewares/validators.ts";

export const userRouter = app.basePath("/users");

userRouter.get("/", authMiddleware, async (c) => {
  const users = await db.query.userTable.findMany();

  return c.json({ users });
});

userRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const payload = c.req.valid("json");

  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${payload.access_token}`,
    },
  });

  if (!res.ok) {
    throw new HTTPException(400, {
      message: "Failed to get user profile from google",
    });
  }

  type Profile = {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };

  const profile: Profile = await res.json();

  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, profile.email),
  });

  if (existingUser) {
    const tokenPayload: TokenPayload = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    };
    const accessToken = await sign(tokenPayload, env.SECRET_KEY);
    const refreshToken = await sign(tokenPayload, env.REFRESH_SECRET_KEY);

    await setSignedCookie(
      c,
      cookieKeys.accessToken,
      accessToken,
      env.SECRET_KEY,
      {
        httpOnly: true,
        expires: new Date(
          Date.now() + env.TOKEN_EXPIRATION_MINUTES * 60 * 1000
        ),
      }
    );

    await setSignedCookie(
      c,
      cookieKeys.refreshToken,
      refreshToken,
      env.REFRESH_SECRET_KEY,
      {
        httpOnly: true,
        expires: new Date(
          Date.now() + env.TOKEN_EXPIRATION_MINUTES * 60 * 1000 * 24
        ),
      }
    );

    c.set("user_id", existingUser.id);

    return c.json({ user: existingUser });
  }

  const [createdUser] = await db
    .insert(userTable)
    .values({
      name: profile.name,
      email: profile.email,
      refer_code: generateReferralCode(),
    })
    .returning();

  const tokenPayload: TokenPayload = {
    id: createdUser.id,
    name: profile.name,
    email: profile.email,
  };

  const accessToken = await sign(tokenPayload, env.SECRET_KEY);
  const refreshToken = await sign(tokenPayload, env.REFRESH_SECRET_KEY);

  await setSignedCookie(
    c,
    cookieKeys.accessToken,
    accessToken,
    env.SECRET_KEY,
    {
      httpOnly: true,
      expires: new Date(Date.now() + env.TOKEN_EXPIRATION_MINUTES * 60 * 1000),
    }
  );

  await setSignedCookie(
    c,
    cookieKeys.refreshToken,
    refreshToken,
    env.REFRESH_SECRET_KEY,
    {
      httpOnly: true,
      expires: new Date(
        Date.now() + env.TOKEN_EXPIRATION_MINUTES * 60 * 1000 * 24
      ),
    }
  );

  return c.json({ user: createdUser });
});

userRouter.post("/refresh", async (c) => {
  const refreshToken = await getSignedCookie(
    c,
    env.REFRESH_SECRET_KEY,
    cookieKeys.refreshToken
  );

  if (!refreshToken) {
    throw new HTTPException(400, {
      message: "Unauthorized refresh token not found",
    });
  }

  try {
    await verify(refreshToken, env.REFRESH_SECRET_KEY);
  } catch (_error) {
    throw new HTTPException(400, {
      message: "Unauthorized refresh token",
    });
  }

  const decoded = decode(refreshToken);

  const userId = decoded.payload.id as number;

  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, userId),
  });

  if (!user) {
    throw new HTTPException(400, {
      message: "Unauthorized invalid user id",
    });
  }

  const tokenPayload: TokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  const newAccessToken = await sign(tokenPayload, env.SECRET_KEY);
  const newRefreshToken = await sign(tokenPayload, env.REFRESH_SECRET_KEY);

  await setSignedCookie(
    c,
    cookieKeys.accessToken,
    newAccessToken,
    env.SECRET_KEY,
    {
      httpOnly: true,
      expires: new Date(Date.now() + env.TOKEN_EXPIRATION_MINUTES * 60 * 1000),
    }
  );

  await setSignedCookie(
    c,
    cookieKeys.refreshToken,
    newRefreshToken,
    env.REFRESH_SECRET_KEY,
    {
      httpOnly: true,
      expires: new Date(
        Date.now() + env.TOKEN_EXPIRATION_MINUTES * 60 * 1000 * 24
      ),
    }
  );

  return c.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

userRouter.get(":id", authMiddleware, validateParamsId, async (c) => {
  const { id } = c.req.valid("param");
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
  });

  if (!user) {
    throw new HTTPException(400, {
      message: "Invalid user id",
    });
  }

  return c.json({ user });
});

userRouter.put(
  ":id",
  authMiddleware,
  validateParamsId,
  zValidator("json", updateUserSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const payload = c.req.valid("json");

    const [updatedUser] = await db
      .update(userTable)
      .set(payload)
      .where(eq(userTable.id, id))
      .returning();

    return c.json({ user: updatedUser });
  }
);
