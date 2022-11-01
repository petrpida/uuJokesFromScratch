"use strict";
const { ObjectId } = require("bson");
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeMongo extends UuObjectDao {
  constructor(...args) {
    super(...args);
  }

  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, categoryIdList: 1 });
    await super.createIndex({ awid: 1, name: 1 });
    await super.createIndex({ awid: 1, averageRating: 1 });
  }

  // create DAO method

  // get DAO method

  // getByName DAO method

  // update DAO method

  // delete DAO method

  // list DAO method

  async list(awid, sortBy, order, pageInfo) {
    const filter = { awid };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }

  async listByCategoryIdList(awid, categoryIdList, sortBy, order, pageInfo) {
    const filter = {
      awid,
      categoryIdList: {
        $in: categoryIdList.map((id) => new ObjectId(id)),
      },
    };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }
}

module.exports = JokeMongo;
