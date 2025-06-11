declare module "hono" {
  interface ContextVariableMap {
    user_id: number;
  }
}

export type TokenPayload = {
  id: number;
  name: string;
  email: string;
};
