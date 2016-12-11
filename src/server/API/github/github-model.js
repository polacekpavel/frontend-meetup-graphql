export default class Github {
  constructor({ connector }) {
    this.github = connector;
  }

  getDetail(githubUsername) {
    return this.github.getDetail(githubUsername)
      .then((res) => {
        return {
          id: res.login,
          fullName: res.name,
          company: res.company,
          avatarSrc: res.avatar_url,
          location: res.location
        };
      });
  }

  getEvents(githubUsername, location) {
    return this.github.getEvents(githubUsername)
      .then((res) => {
        return res.map((event) => {
          return {
            eventType: event.type,
            createdAt: event.created_at,
            url: event.repo && event.repo.url,
            urlName: event.repo && event.repo.name,
            location: location
          };
        });
      });
  }
}