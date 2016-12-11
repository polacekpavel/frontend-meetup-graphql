export default {
  User: {
    github({ githubUsername }, args, { Github }) {
      return Github.getDetail(githubUsername);
    }
  }
};