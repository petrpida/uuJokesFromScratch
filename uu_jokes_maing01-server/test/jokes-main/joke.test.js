const { TestHelper } = require ("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGALL" });
});

afterEach(async  () => {
  await TestHelper.teardown();
});

describe("Joke all uuCmd tests (create, list, get, update, delete)", () => {
  test("test joke uuCommands", async () => {

    // creating joke
    let createResult = await TestHelper.executePostCommand("joke/create", {
      "name": "haha",
      "text": "haha",
    });
    expect(createResult.data.name).toBe("haha");
    expect(createResult.data.uuAppErrorMap).toEqual({});

    // list of jokes after one joke is added
    let listResult = await TestHelper.executeGetCommand("joke/list");
    expect(listResult.data.uuAppErrorMap).toEqual({});
    expect(listResult.data.itemList.length).toBe(1);

    // joke detail
    let getResult = await TestHelper.executeGetCommand("joke/get", {"id": createResult.data.id})
    expect(getResult.data.id).toBe(createResult.data.id)
    expect(getResult.data.name).toBe("haha")
    expect(getResult.data.uuAppErrorMap).toEqual({})

    // updating joke
    let updateResult = await TestHelper.executePostCommand("joke/update", {
      "id": createResult.data.id,
      "name": "hoho",
      "text": "hoho",
    });
    expect(updateResult.data.name).toBe("hoho");
    expect(updateResult.data.uuAppErrorMap).toEqual({});

    // deleting joke
    let deleteResult = await TestHelper.executePostCommand("joke/delete", {"id": createResult.data.id});
    expect(deleteResult.data.uuAppErrorMap).toEqual({});

    // list of jokes after the only one joke is deleted
    let listResultEmpty = await TestHelper.executeGetCommand("joke/list");
    expect(listResultEmpty.data.uuAppErrorMap).toEqual({});
    expect(listResultEmpty.data.itemList.length).toBe(0);
  });
});
