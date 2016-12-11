import DataLoader from "dataloader";
import fetch from "node-fetch";

export default class GithubConnector {
  constructor() {
    this.apiKey = 'df9802f355d07cbeb0b309b4f4096a1a5cf8d50c';

    this.detailLoader = new DataLoader(this.fetch.bind(this), { batch: false });
    this.eventsLoader = new DataLoader(this.fetch.bind(this), { batch: false });
  }

  fetch(path) {
    return fetch(path[0], {
      headers: {
        Authorization: `token ${this.apiKey}`
      }
    }).then((res) => {
      return res.json();
    }).then((res) => {
      return [res];
    });
  }

  getDetail(username) {
    return this.detailLoader.load(`https://api.github.com/users/${username}`);
  }

  getEvents(username) {
    return this.eventsLoader.load(`https://api.github.com/users/${username}/events`);
  }
}