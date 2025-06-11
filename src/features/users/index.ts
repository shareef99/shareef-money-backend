import { zValidator } from "@hono/zod-validator";
import app from "../../app.ts";
import { db } from "../../db/index.ts";
import { loginSchema } from "./validators.ts";
import { eq } from "drizzle-orm";
import { userTable } from "./schema.ts";
import { TokenPayload } from "../../types/app.ts";
import { decode, sign, verify } from "hono/jwt";
import env from "../../env.ts";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { cookieKeys } from "../../constants/index.ts";
import { generateReferralCode } from "../../helpers/index.ts";
import { HTTPException } from "hono/http-exception";

export const userRouter = app.basePath("/users");

userRouter.get("/", async (c) => {
  const users = await db.query.userTable.findMany();

  return c.json({ users });
});

userRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const payload = c.req.valid("json");

  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, payload.email),
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

    return c.json({ user: existingUser, accessToken, refreshToken });
  }

  const [createdUser] = await db
    .insert(userTable)
    .values({
      name: payload.name,
      email: payload.email,
      refer_code: generateReferralCode(),
    })
    .returning();

  const tokenPayload: TokenPayload = {
    id: createdUser.id,
    name: payload.name,
    email: payload.email,
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

  return c.json({ user: createdUser, accessToken, refreshToken });
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
