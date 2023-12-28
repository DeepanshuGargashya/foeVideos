const getPagination = (page, size) => {
  const limit = size ? +size : 1;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

const getPages = (total, limit) => {
  const pages = limit > 0 ? Math.ceil(total / limit) || 1 : null;
  return pages;
};

export default {
  getPagination,
  getPages,
};
