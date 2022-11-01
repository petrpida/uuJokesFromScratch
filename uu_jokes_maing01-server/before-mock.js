// if you don't use the default awid, change that everywhere aswell
db.createCollection("joke");
db.joke.insert({
  _id: ObjectId("61e1574817f0e248baf15f70"),
  name: "Bunny ate the wedding ring!",
  image: null,
  text: "Why did the bunny eat the wedding ring? Because he heard it was 18 carrots!",
  averageRating: 4,
  ratingCount: 1,
  uuIdentity: "6397-832-1", // add your uuIdentity (22-2312-1)
  uuIdentityName: "Petr Studený", // add your uuIdentity name (Holly Hudson)
  awid: "22222222222222222222222222222222",
  sys: { cts: "2021-11-08T14:17:41.202Z", mts: "2022-03-01T15:07:00.989Z", rev: 0 },
  visibility: true,
  categoryIdList: [ObjectId("615d7540917ec500271203c1")],
});

db.createCollection("jokeRating");
db.jokeRating.insert({
  awid: "22222222222222222222222222222222",
  sys: {
    cts: "2022-01-14 10:58:16.037Z",
    mts: "2022-01-14 10:58:16.037Z",
    rev: 0,
  },
  jokeId: ObjectId("61e1574817f0e248baf15f70"),
  uuIdentity: "6397-832-1",
  value: 4,
});

db.createCollection("category");
db.category.insert({
  _id: ObjectId("615d7540917ec500271203c1"),
  awid: "22222222222222222222222222222222",
  icon: "mdi-codepen",
  name: "nature",
  sys: { cts: "2021-10-06T10:06:56.812Z", mts: "2021-11-09T14:30:07.304Z", rev: 0 },
});
