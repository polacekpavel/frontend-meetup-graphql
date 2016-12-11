export default class UserModel {
  constructor({ connector }) {
    this.User = connector;
  }

  getAll(offset, limit) {
    return this.User.findAll({
      offset,
      limit
    });
  }

  getByGithubUsername(githubUsername) {
    return this.User.findOne({
      where: {
        githubUsername: githubUsername
      }
    });
  }

  getById(userId) {
    return this.User.findById(userId);
  }

  create(githubUsername, firstName, lastName) {
    return this.User.create({
      githubUsername,
      lastName,
      firstName
    });
  }
}