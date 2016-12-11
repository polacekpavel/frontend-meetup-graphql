import { pubsub } from "./subscriptions";
import Promise from "bluebird";

export default  {
  Query: {
    users(root, { offset, limit }, { Users }) {
      return Users.getAll(offset, limit);
    },
    user(root, { githubUsername }, { Users }) {
      return Users.getByGithubUsername(githubUsername);
    }
  },
  Mutation: {
    createUser(root, { githubUsername, firstName, lastName }, { Users }) {
      return Promise.delay(1000).then(() => {
        return Users.create(githubUsername, firstName, lastName)
          .then((user) => {
            pubsub.publish('userCreated', user);
          });
      });
    }
  },
  Subscription: {
    userCreated(user) {
      return user;
    }
  }
};