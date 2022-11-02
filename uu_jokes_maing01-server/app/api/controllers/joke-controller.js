"use strict";
const ListAbl = require("../../abl/joke/list-abl");
const GetAbl = require("../../abl/joke/get-abl");

class JokeController {

  static list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static get(ucEnv) {
    return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  // create

  // update

  // delete

}

module.exports = JokeController;
