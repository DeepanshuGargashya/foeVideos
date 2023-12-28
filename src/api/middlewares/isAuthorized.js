const isAuthorized = (roles = []) => {
  // roles param can be a single role string (e.g. Role.Customer or 'Milkman')
  // or an array of roles (e.g. [Role.Admin, Role.Customer] or ['Admin', 'Customer', 'Milkman'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.token?.role)) {
        // user's role is not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }

      // authentication and authorization successful
      next();
    },
  ];
};

export default isAuthorized;
