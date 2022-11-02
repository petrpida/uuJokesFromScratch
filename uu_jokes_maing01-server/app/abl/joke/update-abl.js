"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuBinaryAbl } = require("uu_appg01_binarystore-cmd");
const Errors = require("../../api/errors/joke-error");
const Warnings = require("../../api/warnings/joke-warning");
const InstanceChecker = require("../../component/instance-checker");
const Joke = require("../../component/joke");
const { Profiles, Schemas, Jokes } = require("../constants");

class UpdateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.JOKE);
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1, 1.1
    const validationResult = this.validator.validate("jokeUpdateDtoInType", dtoIn);
    // 1.2, 1.2.1, 1.3, 1.3.1
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // hds 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
      [Profiles.EXECUTIVES]: new Set([Jokes.States.ACTIVE, Jokes.States.UNDER_CONSTRUCTION]),
    };
    // 2.1, 2.1.1, 2.2, 2.2.1, 2.2.2
    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors.Update,
      uuAppErrorMap
    );

    // hds 3, 3.1
    if (dtoIn.image && dtoIn.deleteImage) {
      throw new Errors.Update.InvalidInputCombination({ uuAppErrorMap });
    }

    // hds 4
    const joke = await this.dao.get(awid, dtoIn.id);
    if (!joke) {
      // 4.1
      throw new Errors.Update.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }

    // hds 5
    const uuIdentity = session.getIdentity().getUuIdentity();
    const isAuthorities = authorizationResult.getAuthorizedProfiles().includes(Profiles.AUTHORITIES);
    if (uuIdentity !== joke.uuIdentity && !isAuthorities) {
      // 5.1
      throw new Errors.Update.UserNotAuthorized({ uuAppErrorMap });
    }

    // hds 6
    const isEmptyText = "text" in dtoIn && dtoIn.text.trim().length === 0;
    // 6.1
    if (isEmptyText && !dtoIn.image && !joke.image) {
      // note: if joke doesn't have image it must have a text
      throw new Errors.Update.TextCannotBeRemoved(uuAppErrorMap, { text: dtoIn.text });
    }
    // 6.2
    if (dtoIn.deleteImage && joke.image && !joke.text && (isEmptyText || !dtoIn.text)) {
      throw new Errors.Update.ImageCannotBeDeleted(uuAppErrorMap);
    }

    // hds 7, 7.1
    const toUpdate = { ...dtoIn };
    delete toUpdate.deleteImage;
    // Note: empty array is valid (possibility to remove all categories)
    if (dtoIn.categoryIdList) {
      const { validCategories, invalidCategories } = await Joke.checkCategoriesExistence(awid, dtoIn.categoryIdList);
      if (invalidCategories.length > 0) {
        // 7.2
        ValidationHelper.addWarning(
          uuAppErrorMap,
          Warnings.Update.CategoryDoesNotExist.code,
          Warnings.Update.CategoryDoesNotExist.message,
          { categoryIdList: invalidCategories }
        );
      }
      toUpdate.categoryIdList = validCategories;
    }

    // hds 8
    if (dtoIn.image) {
      let binary;
      // 8.1, 8.1.1
      const image = await Joke.checkAndGetImageAsStream(dtoIn.image, Errors.Update, uuAppErrorMap);

      if (!joke.image) {
        // 8.2, 8.2.A
        try {
          binary = await UuBinaryAbl.createBinary(awid, {
            data: image,
            filename: dtoIn.image.filename,
            contentType: dtoIn.image.contentType,
          });
        } catch (e) {
          // 8.2.A.1
          throw new Errors.Update.UuBinaryCreateFailed({ uuAppErrorMap }, e);
        }
      } else {
        // 8.2.B
        try {
          binary = await UuBinaryAbl.updateBinaryData(awid, {
            data: image,
            code: joke.image,
            filename: dtoIn.image.filename,
            contentType: dtoIn.image.contentType,
            revisionStrategy: "NONE",
          });
        } catch (e) {
          // 8.2.B.1
          throw new Errors.Update.UuBinaryUpdateBinaryDataFailed({ uuAppErrorMap }, e);
        }
      }
      toUpdate.image = binary.code;
    }

    // hds 9
    if (dtoIn.deleteImage && joke.image) {
      await UuBinaryAbl.deleteBinary(awid, {
        code: joke.image,
        revisionStrategy: "NONE",
      });
      toUpdate.image = null;
    }

    // hds 10
    toUpdate.awid = awid;
    let updatedJoke;
    try {
      updatedJoke = await this.dao.update(toUpdate);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // 10.1
        throw new Errors.Update.JokeDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    // hds 11
    const dtoOut = {
      ...updatedJoke,
      uuAppErrorMap,
    };

    return dtoOut;
  }
}

module.exports = new UpdateAbl();
