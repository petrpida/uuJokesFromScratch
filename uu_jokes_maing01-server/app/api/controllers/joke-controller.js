"use strict";
const ListAbl = require("../../abl/joke/list-abl");
const GetAbl = require("../../abl/joke/get-abl");
const CreateAbl = require("../../abl/joke/create-abl");
const UpdateAbl = require("../../abl/joke/update-abl");
const DeleteAbl = require("../../abl/joke/delete-abl");

class JokeController {

  static list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static get(ucEnv) {
    return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  static create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  static update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

  static delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.session, ucEnv.getAuthorizationResult());
  }

}

module.exports = JokeController;
