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
