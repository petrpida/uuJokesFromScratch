const jokeListDtoInType = shape({
  sortBy: oneOf(["name", "averageRating"]),
  order: oneOf(["asc", "desc"]),
  categoryIdList: array(id(), 1, 10),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const jokeGetDtoInType = shape({
  id: id().isRequired(),
});

const jokeCreateDtoInType = shape({
  name: uu5String(255).isRequired(),
  text: uu5String(4000).isRequired("image"),
  categoryIdList: array(id(), 1, 10),
  image: binary().isRequired("text"),
});

const jokeUpdateDtoInType = shape({
  id: id().isRequired(),
  name: uu5String(255),
  text: uu5String(4000),
  categoryIdList: array(id(), 10),
  image: binary(),
  deleteImage: boolean(),
});
