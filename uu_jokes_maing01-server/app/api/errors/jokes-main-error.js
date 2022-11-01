"use strict";
const JokesMainUseCaseError = require("./jokes-main-use-case-error.js");
const JOKES_MAIN_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}jokesMain/`;

const Init = {
  UC_CODE: `${JOKES_MAIN_ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  JokesDaoCreateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}jokesDaoCreateFailed`;
      this.message = "Create jokes by DAO method failed.";
    }
  },
};

const Load = {
  UC_CODE: `${JOKES_MAIN_ERROR_PREFIX}load/`,

  JokesMainDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}jokesMainDoesNotExist`;
      this.message = "UuObject jokesMain does not exist.";
    }
  },
};

module.exports = {
  Init,
  Load,
};
