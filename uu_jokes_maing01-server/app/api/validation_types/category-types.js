const categoryListDtoInType = shape({
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  }),
});
