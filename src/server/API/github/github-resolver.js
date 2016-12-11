export default {
  Github: {
    events({ id, location }, args, { Github }) {
      return Github.getEvents(id, location);
    }
  }
};