import { makeSchema, objectType, inputObjectType, mutationType, nonNull, arg } from "nexus";
import { join } from "path";
import { signSession, SESSION_COOKIE_NAME } from "../context";
import type { AuthContext } from "../context";
import { handleLogin, handleRegister } from "./authResolvers";

const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("email");
    t.nonNull.string("name");
  }
});

const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.field("user", { type: User });
  }
});

const RegisterInput = inputObjectType({
  name: "RegisterInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.string("name");
  }
});

const LoginInput = inputObjectType({
  name: "LoginInput",
  definition(t) {
    t.nonNull.string("email");
    t.nonNull.string("password");
  }
});

const Mutation = mutationType({
  definition(t) {
    t.nonNull.field("registerUser", {
      type: AuthPayload,
      args: {
        input: nonNull(arg({ type: RegisterInput }))
      },
      async resolve(_root, { input }, ctx: AuthContext) {
        const user = await handleRegister(input, ctx);
        const token = signSession(user.id);
        ctx.res.cookie(SESSION_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7,
          path: "/"
        });

        return { user };
      }
    });

    t.nonNull.field("loginUser", {
      type: AuthPayload,
      args: {
        input: nonNull(arg({ type: LoginInput }))
      },
      async resolve(_root, { input }, ctx: AuthContext) {
        const user = await handleLogin(input, ctx);
        const token = signSession(user.id);
        ctx.res.cookie(SESSION_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7,
          path: "/"
        });

        return { user };
      }
    });
  }
});

export const schema = makeSchema({
  types: [User, AuthPayload, RegisterInput, LoginInput, Mutation],
  outputs: {
    schema: join(__dirname, "../../generated/schema.graphql"),
    typegen: join(__dirname, "../../generated/nexus-typegen.ts")
  },
  contextType: {
    module: join(__dirname, "../context"),
    export: "AuthContext"
  }
});
