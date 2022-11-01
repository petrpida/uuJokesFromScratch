"use strict";

const JokesMainUseCaseError = require("./jokes-main-use-case-error");
const CATEGORY_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}category/`;

const List = {
  UC_CODE: `${CATEGORY_ERROR_PREFIX}list/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokesDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}jokesDoesNotExist`;
      this.message = "UuObject jokes does not exist.";
    }
  },
  JokesNotInCorrectState: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}jokesNotInCorrectState`;
      this.message = "UuObject jokes is not in correct state.";
    }
  },
};

module.exports = {
  List,
};
