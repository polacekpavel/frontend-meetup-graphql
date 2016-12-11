import DataLoader from "dataloader";
import fetch from "node-fetch";

export default class WeatherConnector {
  constructor() {
    this.locationLoader = new DataLoader(this.fetch.bind(this), { batch: false });
    this.weatherLoader = new DataLoader(this.fetch.bind(this), { batch: false });
  }

  fetch(path) {
    return fetch(path[0])
      .then((res) => [res.json()]);
  }

  getWeather(location, createdAt) {
    const apiKey = 'ff3540f220314e9a48459f8dd7defd8e';

    return this.locationLoader.load(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}`)
      .then((res) => {
        const lat = res.results[0].geometry.location.lat;
        const long = res.results[0].geometry.location.lng;

        return {
          lat,
          long
        };
      }).then((res) => {
        const time = Math.round(new Date(createdAt).getTime() / 1000);
        return this.weatherLoader.load(`https://api.darksky.net/forecast/${apiKey}/${res.lat},${res.long},${time}?exclude=currently,flags`)         ;
      });
  }
}