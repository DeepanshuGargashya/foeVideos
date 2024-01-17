class BadError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadError";
  }
}

export default {
  BadError,
};
