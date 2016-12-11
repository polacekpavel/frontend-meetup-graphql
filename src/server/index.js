import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { subscriptionManager } from "./API/subscriptions";
import { createServer } from "http";
import { OperationStore } from "graphql-server-module-operation-store";
import { graphqlExpress, graphiqlExpress } from "graphql-server-express";
import { schema } from "./API";
import GithubConnector from "./connectors/github";
import WeatherConnector from "./connectors/weather";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { User as UserConnector } from "./connectors/db";
import UserModel from "./API/user/user-model";
import GithubModel from "./API/github/github-model";
import WeatherModel from "./API/weather/weather-model";
import operationsQuery from "./../../extracted_queries.json";
import _ from "lodash";

const app = express();
const PORT = process.env.PORT || 8080;
const WS_PORT = process.env.WS_PORT || 8081;

app.use('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const store = new OperationStore(schema);
_.forOwn(operationsQuery, (item, value) => {
  store.put(value);
});
app.use('/graphql', graphqlExpress({
  schema: schema,
  // formatParams(params) {
  //   params['query'] = store.get(params.operationName);
  //   return params;
  // },
  context: {
    Users: new UserModel({ connector: UserConnector }),
    Github: new GithubModel({ connector: new GithubConnector() }),
    Weather: new WeatherModel({ connector: new WeatherConnector() })
  }
}));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

websocketServer.listen(WS_PORT, () => console.log(`Websocket Server is now running on http://localhost:${WS_PORT}`));

new SubscriptionServer({
  subscriptionManager,
  onSubscribe: (msg, params) => {
    return Object.assign({}, params, {
      // formatParams(params) {
      //   params['query'] = store.get(params.operationName);
      //   return params;
      // },
      context: {
        Users: new UserModel({ connector: UserConnector }),
        Github: new GithubModel({ connector: new GithubConnector() }),
        Weather: new WeatherModel({ connector: new WeatherConnector() })
      }
    });
  }
}, websocketServer);