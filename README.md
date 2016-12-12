# Frontend graphql meetup at STRV

## What is included
* Webpack loader
* React Apollo
* Optimistic UI
* Subscription
* Pagination
* Prefetching
* Peristed queries

```javascript

```
## Connect React with graphql
src/client/index.js
```javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./client/App";
import ApolloClient, { createNetworkInterface } from "apollo-client";
import { ApolloProvider } from "react-apollo";

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql'
});

const client = new ApolloClient({
  networkInterface
});
ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root')
);
```
###Query data with graphql
src/client/Users.js

via high order function 
```javascript
import React, { Component } from "react";
import { graphql } from "react-apollo";
import getAllUsersQuery from "./API/getAllUsers.graphql";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: true     
    };
  }

  render() {
    return (
      <div>
        {
          this.props.data.users && this.props.data.users.sort((a, b) => a.id - b.id).map((item) => {
            return <div key={item.id} className="row" onClick={() => {
              if (this.props.onClick) {
                this.props.onClick(item);
              }
            }
            }>
              {item.id} : {item.firstName} {item.lastName}
            </div>;
          })
        }      
      </div>
    );
  }
}
export default graphql(getAllUsersQuery)(Users);
```

Or via decorators

You can import your *.graphql queries with webpack loader

```javascript
{
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
}
```

```javascript
import createUserQuery from './API/createUser.graphql';
```
And then use it directly in code without gql tag
```javascript
@graphql(getAllUsersQuery)
class Users extends Component {
    ....
}
```
Your data will be available in the *this.props.data*

### Query data with variables
src/client/UserDetail.js
```javascript
import { graphql } from "react-apollo";
import getUserDetailQuery from "./API/getUserDetail.graphql";

@graphql(getUserDetailQuery, {
  options: (props) => {
    return {
      variables: {
        githubUsername: props.user.github.id
      }
    };
  }
})
class UserDetail extends Component {
    ...
}
```

###Mutation
src/client/CreateUser.js

```javascript
import { graphql } from "react-apollo";
import createUserQuery from "./API/createUser.graphql";

@graphql(createUserQuery, { name: 'createUser' })
class CreateUser extends Component {
    ...
    <button className="btn btn-success"
            onClick={() => {
            this.props.createUser({
             variables: {
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              githubUsername: this.state.githubUsername
            }
          }).then(() => this.props.onCreate());
        }}>
      Save
    </button>
}
```

Decorator will create a method this.props.createUser.
You can change name with name parameter.
 
### Refreshing data
#### Pooling
src/client/User.js 
Check for new data every second.
```javascript
@graphql(getAllUsersQuery, { options: { pollInterval: 1000 } })
class Users extends Component {
    ...
}
```

#### Subscription with web sockets
src/index.js

```javascript
import ApolloClient, { createNetworkInterface } from "apollo-client";
import { print } from 'graphql-tag/printer';
import { Client } from 'subscriptions-transport-ws';
import { ApolloProvider } from "react-apollo";

const addGraphqlSubscription = (networkInterface, wsClient) => Object.assign(networkInterface, {
  subscribe: (request, handler) => wsClient.subscribe({
    query: print(request.query),
    variables: request.variables
  }, handler),
  unsubscribe: (id) => {
      wsClient.unsubscribe(id);
  }
});

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8080/graphql'
});

const wsClient = new Client('ws://localhost:8081');

const client = new ApolloClient({
  networkInterface: addGraphqlSubscription(networkInterface, wsClient)
});
```

src/client/users.js
```javascript
import userCreatedQuery from "./API/userCreated.graphql";
class Users extends Component {    
    ...
    componentWillReceiveProps(nextProps) {
        if (!this.subscription && !nextProps.loading) {
          this.subscription = this.props.data.subscribeToMore({
            document: userCreatedQuery,
            updateQuery: (previousState, subscriptionResult) => {
              const newUser = subscriptionResult.subscriptionData.data.userCreated;
              return update(previousState, {
                users: {
                  $unshift: [newUser]
                }
              });
            }
          });
        }
      }
    ...
}
```

### Optimistic ui
src/client/CreateUser.js
```javascript
this.props.createUser({
                    variables: {
                      firstName: this.state.firstName,
                      lastName: this.state.lastName,
                      githubUsername: this.state.githubUsername
                    },
                    optimisticResponse: {
                      createUser: {
                        id: 1000,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        github: {
                          id: this.state.githubUsername
                        }
                      }
                    },
                    updateQueries: {
                      getAllUsers: (previousState, mutationData) => {
                        const newUser = mutationData.mutationResult.data.createUser;
                        if (!newUser) {
                          return previousState;
                        }

                        return update(previousState, {
                          users: {
                            $unshift: [newUser]
                          }
                        });
                      }
                    }
                  }).then(() => this.props.onCreate());
```

### Pagination

src/client/Users.js
```javascript
@graphql(getAllUsersQuery, {
  options: {
    variables: {
      limit: 1,
      offset: 0
    }
  }
})
class Users extends Component {
    ...
       <button className='btn btn-success'
               onClick={() => {
                 this.props.data.fetchMore({
                   variables: {
                     offset: this.props.data.users.length
                   },
                     const newUsers = fetchMoreData.fetchMoreResult.data.users;
                     return update(previousState, {
                       users: {
                         $unshift: newUsers
                       }
                     });
                   }
                 });
               }
               }>
         Load more
       </button>
    ...
}
```
### Prefetching queries
src/client/Users.js
```javascript
import { graphql, withApollo } from "react-apollo";

@withApollo
class Users extends Component {
    ...
    this.props.data.users && this.props.data.users.sort((a, b) => a.id - b.id).map((item) => {
                return <div key={item.id} className="row" onMouseOver={() => {
                  this.props.client.query({
                    query: userDetailQuery,
                    variables: {
                      githubUsername: item.github.id
                    }
                  });
                }}
}
```

### Persisted queries
Harvest all of your client queries using [extractgql](https://github.com/Poincare/extractgql)

```bash
extractgql src/client/
```

src/server/index.js
```javascript
const store = new OperationStore(schema);
_.forOwn(operationsQuery, (item, value) => {
  store.put(value);
});
app.use('/graphql', graphqlExpress({
  schema: schema,
  formatParams(params) {
    params['query'] = store.get(params.operationName);
    return params;
  },
  context: {
    Users: new UserModel({ connector: UserConnector }),
    Github: new GithubModel({ connector: new GithubConnector() }),
    Weather: new WeatherModel({ connector: new WeatherConnector() })
  }
}));
```

### Batching graphql requests
src/index.js
```javascript
import ApolloClient, { createBatchingNetworkInterface } from "apollo-client";
...
const networkInterface = createBatchingNetworkInterface({
  uri: 'http://localhost:8080/graphql',
  batchInterval: 500
});
...
```