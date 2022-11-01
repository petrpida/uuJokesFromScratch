"use strict";
const ListAbl = require("../../abl/category/list-abl");

class CategoryController {

  static list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.parameters, ucEnv.getAuthorizationResult());
  }

  // get

  // create

  // update

  // delete

}

module.exports = CategoryController;

