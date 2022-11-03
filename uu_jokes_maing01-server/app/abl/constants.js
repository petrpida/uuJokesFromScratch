//@@viewOn:constants
const Constants = {
  Schemas: {
    JOKES_MAIN: "jokesMain",
    CATEGORY: "category",
    JOKE: "joke",
    JOKE_RATING: "jokeRating",
  },

  Jokes: {
    States: {
      INIT: "init",
      ACTIVE: "active",
      UNDER_CONSTRUCTION: "underConstruction",
      CLOSED: "closed",
    },
    get NonFinalStates() {
      return new Set([this.States.ACTIVE, this.States.UNDER_CONSTRUCTION]);
    },
  },

  Profiles: {
    AUTHORITIES: "Authorities",
    EXECUTIVES: "Executives",
    READERS: "Readers",
  },
};
//@@viewOff:constants

//@@viewOn:exports
module.exports = Constants;
//@@viewOff:exports
