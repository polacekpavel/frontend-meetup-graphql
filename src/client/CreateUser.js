import React, { Component } from "react";
import { graphql } from "react-apollo";
import createUserQuery from "./API/createUser.graphql";
import update from "immutability-helper";

@graphql(createUserQuery, { name: 'createUser' })
class CreateUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: null,
      lastName: null,
      githubUsername: null
    };
  }

  render() {
    return (
      <div className="create-user-form">
        <div>
          <label>First name: </label>
          <input type="text" className="main-input" placeholder="First name"
                 onChange={(e) => this.setState({ firstName: e.target.value }) }/>
        </div>
        <div>
          <label>Last name: </label>
          <input type="text" className="main-input" placeholder="Last name"
                 onChange={(e) => this.setState({ lastName: e.target.value }) }/>
        </div>
        <div>
          <label>Github username: </label>
          <input type="text" className="main-input" placeholder="Github username"
                 onChange={(e) => this.setState({ githubUsername: e.target.value }) }/>
        </div>
        <button className="btn btn-success"
                onClick={() => {
                  this.props.createUser({
                    variables: {
                      firstName: this.state.firstName,
                      lastName: this.state.lastName,
                      githubUsername: this.state.githubUsername
                    },
                    optimisticResponse: {
                      createUser: {
                        id: 10000,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        githubUsername: this.state.githubUsername
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
                }}>
          Save
        </button>
      </div>
    );
  }
}

export default CreateUser;
