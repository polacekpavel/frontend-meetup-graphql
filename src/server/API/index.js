import _ from "lodash";
import githubSchema from "./github/github.graphqls";
import userSchema from "./user/user.graphqls";
import rootSchema from "./root.graphqls";
import eventSchema from "./event/event.graphqls";
import weatherSchema from "./weather/weather.graphqls";
import githubResolver from "./github/github-resolver";
import userResolver from "./user/user-resolver";
import eventResolver from "./event/event-resolver";
import rootResolver from "./root-resolver";
import { makeExecutableSchema } from "graphql-tools";

const mergedSchema = [githubSchema, userSchema, eventSchema, weatherSchema, rootSchema];
const resolvers = _.merge(githubResolver, userResolver, eventResolver, rootResolver);

const schema = makeExecutableSchema({
  typeDefs: mergedSchema,
  resolvers
});
export { schema };