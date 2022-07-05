import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";
import {
  buildSchema,
  Resolver,
  Query,
  Arg,
  ObjectType,
  Field,
  ID,
} from "type-graphql";

@ObjectType()
export class Dog {
  @Field(() => ID)
  name: string | undefined;
}

@Resolver(Dog)
export class DogsResolver {
  @Query(() => [Dog])
  dogs(): Dog[] {
    return [{ name: "Bo" }, { name: "Lassie" }];
  }
}

const schema = await buildSchema({
  resolvers: [DogsResolver],
});

const server = new ApolloServer({ schema });

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = server.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
}
