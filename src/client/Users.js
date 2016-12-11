import React, { Component } from "react";
import { graphql, withApollo } from "react-apollo";
import getAllUsersQuery from "./API/getAllUsers.graphql";
import getUserDetailQuery from "./API/getUserDetail.graphql";
import userCreatedSubscription from "./API/userCreated.graphql";
import update from "immutability-helper";

@graphql(getAllUsersQuery, {
  options: {
    variables: {
      limit: 1,
      offset: 0
    }
  }
})
@withApollo
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetail: true,
      users: [{
        id: 1,
        firstName: 'Pavel',
        lastName: 'Polacek',
        github: {
          id: 'polacekpavel'
        }
      }, {
        id: 2,
        firstName: 'Michal',
        lastName: 'Klacko',
        github: {
          id: 'miklacko'
        }
      }]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.subscription && !nextProps.loading) {
      this.subscription = this.props.data.subscribeToMore({
        document: userCreatedSubscription,
        updateQuery: (previousResult, subscriptionResult) => {
          const newUser = subscriptionResult.subscriptionData.data.userCreated;
          return update(previousResult, {
            users: {
              $unshift: [newUser]
            }
          });
        }
      });
    }
  }

  render() {
    return (
      <div>
        {
          this.props.data.users && this.props.data.users.sort((a, b) => a.id - b.id).map((item) => {
            return <div key={item.id} className="row"
                        onMouseOver={() => {
                          this.props.client.query({
                            query: getUserDetailQuery,
                            variables: {
                              githubUsername: item.github.id
                            }
                          });
                        }}
                        onClick={() => {
                          if (this.props.onClick) {
                            this.props.onClick(item);
                          }
                        }
                        }>
              {item.id} : {item.firstName} {item.lastName}
            </div>;
          })
        }

        <button className='btn btn-success'
                onClick={() => {
                  this.props.data.fetchMore({
                    variables: {
                      offset: this.props.data.users.length
                    },
                    updateQuery: (previousResult, fetchMoreData) => {
                      const newUser = fetchMoreData.fetchMoreResult.data.users;
                      return update(previousResult, {
                        users: {
                          $unshift: newUser
                        }
                      });
                    }
                  });
                }
                }>
          Load more
        </button>
      </div>
    );
  }
}

export default Users;