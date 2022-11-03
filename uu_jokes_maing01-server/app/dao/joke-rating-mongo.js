"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeRatingMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, jokeId: 1 });
  }

  async deleteByJokeId(awid, jokeId) {
    await super.deleteMany({ awid, jokeId });
  }
}

module.exports = JokeRatingMongo;
