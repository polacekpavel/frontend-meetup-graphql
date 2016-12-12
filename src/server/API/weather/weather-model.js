export default class Weather {
  constructor({ connector }) {
    this.weather = connector;
  }

  getWeather(location, createdAt) {
    return this.weather.getWeather(location, createdAt)
      .then((res) => {
        return {
          condition: 'fog'
          // condition: res.daily.data[0].icon
        };
      });
  }
}