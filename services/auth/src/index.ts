import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server-express4";
import { json } from "body-parser";
import { schema } from "./graphql/schema";
import { contextFactory } from "./context";

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
    schema
  });

  await server.start();

  app.use("/graphql", json(), expressMiddleware(server, { context: contextFactory }));

  const port = Number(process.env.PORT ?? 4001);
  app.listen({ port }, () => {
    console.log(`Auth service ready at http://localhost:${port}/graphql`);
  });
}

start().catch((error) => {
  console.error("Failed to start auth service", error);
  process.exit(1);
});
