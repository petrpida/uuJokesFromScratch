"use strict";
const ListAbl = require("../../abl/joke/list-abl");

class JokeController {

  static list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  // get

  // create

  // update

  // delete

}

module.exports = JokeController;
