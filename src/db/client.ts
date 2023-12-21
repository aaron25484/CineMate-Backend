import { PrismaClient as MongoClient } from "../../prisma/generated/mongodb_client";
import { Prisma } from "../../prisma/generated/mongodb_client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export const DATA_SOURCE: String = process.env.DATA_SOURCE ?? "mongo";
//export const DATA_SOURCE: String = "postgresql";

type ClientMongo = MongoClient<Prisma.PrismaClientOptions, never, DefaultArgs>;


export const mongoClient: ClientMongo = new MongoClient();

export let prismaClient: any;

console.log(`DATA_SOURCE before if: ${DATA_SOURCE}`);

if (DATA_SOURCE === "postgresql") {
  console.log("Connecting to PostgreSQL...");
} else {
  prismaClient = mongoClient;
  console.log("Connecting to MongoDB...");
}
