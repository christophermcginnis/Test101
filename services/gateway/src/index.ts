import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server-express4";
import { json } from "body-parser";
import { makeExecutableSchema } from "@graphql-tools/schema";
import fetch, { HeadersInit } from "node-fetch";
import { contextFactory, GatewayContext } from "./context";

const typeDefs = /* GraphQL */ `
  type FeedItem {
    id: ID!
    title: String!
    summary: String!
  }

  type User {
    id: ID!
    email: String!
    name: String!
  }

  type AuthPayload {
    user: User!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    feed: [FeedItem!]!
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
  }
`;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? "http://localhost:4001/graphql";

async function forwardToAuth(
  ctx: GatewayContext,
  query: string,
  variables: Record<string, unknown>
): Promise<unknown> {
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  };
  const cookie = ctx.req.headers.cookie;
  if (cookie) {
    headers.Cookie = cookie;
  }

  const response = await fetch(AUTH_SERVICE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables })
  });

  const setCookie = response.headers.raw()["set-cookie"];
  if (setCookie) {
    setCookie.forEach((value) => ctx.res.append("set-cookie", value));
  }

  const payload = await response.json();
  if (!response.ok || payload.errors) {
    const message = payload.errors?.[0]?.message ?? "Auth service error";
    throw new Error(message);
  }
  return payload.data;
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      feed: (_: unknown, __: unknown, ctx: GatewayContext) => {
        if (!ctx.userId) {
          const error = new Error("Unauthorized");
          (error as any).statusCode = 401;
          throw error;
        }

        return [
          {
            id: "post-1",
            title: "Welcome to Community Circles",
            summary: "Kickstart your creator journey by setting up your first circle."
          },
          {
            id: "post-2",
            title: "Public Center Highlights",
            summary: "Drop into the latest voice rooms and discover trending conversations."
          }
        ];
      }
    },
    Mutation: {
      registerUser: async (_: unknown, args: { input: Record<string, unknown> }, ctx: GatewayContext) => {
        const data = await forwardToAuth(
          ctx,
          /* GraphQL */ `
            mutation Register($input: RegisterInput!) {
              registerUser(input: $input) {
                user {
                  id
                  email
                  name
                }
              }
            }
          `,
          { input: args.input }
        );
        return (data as any).registerUser;
      },
      loginUser: async (_: unknown, args: { input: Record<string, unknown> }, ctx: GatewayContext) => {
        const data = await forwardToAuth(
          ctx,
          /* GraphQL */ `
            mutation Login($input: LoginInput!) {
              loginUser(input: $input) {
                user {
                  id
                  email
                  name
                }
              }
            }
          `,
          { input: args.input }
        );
        return (data as any).loginUser;
      }
    }
  }
});

async function start() {
  const app = express();

  app.use(
    cors({
      origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
      credentials: true
    })
  );
  app.use(cookieParser());

  const server = new ApolloServer({
    schema,
    formatError(formattedError) {
      const status = (formattedError.originalError as any)?.statusCode;
      if (status === 401) {
        return {
          ...formattedError,
          extensions: {
            ...formattedError.extensions,
            code: "UNAUTHENTICATED"
          }
        };
      }
      return formattedError;
    }
  } as any);

  await server.start();

  app.use("/graphql", json(), expressMiddleware(server as any, { context: contextFactory }));

  const port = Number(process.env.PORT ?? 4100);
  app.listen({ port }, () => {
    console.log(`Gateway ready at http://localhost:${port}/graphql`);
  });
}

start().catch((error) => {
  console.error("Failed to start gateway", error);
  process.exit(1);
});
