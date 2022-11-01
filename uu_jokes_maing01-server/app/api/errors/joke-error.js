"use strict";

const JokesMainUseCaseError = require("./jokes-main-use-case-error");
const JOKE_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}joke/`;

const List = {
  UC_CODE: `${JOKE_ERROR_PREFIX}list/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokesMainDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}jokesMainDoesNotExist`;
      this.message = "UuObject jokesMain does not exist.";
    }
  },
  JokesMainNotInCorrectState: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}jokesMainNotInCorrectState`;
      this.message = "UuObject jokesMain is not in correct state.";
    }
  },
};

module.exports = {
  List,
};
