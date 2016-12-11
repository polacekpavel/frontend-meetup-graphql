export default {
  Event: {
    weather({ location, createdAt }, args, { Weather }) {
      return Weather.getWeather(location, createdAt);
    }
  }
};