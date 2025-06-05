export default {
  Default: "",
  Base: "/api",
  Auth: {
    Base: "/auth",
    Login: "/login",
    Register: "/register",
  },
  Users: {
    Base: "/users",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
    Pagination: "/pagination",
    Search: "/search",
  },
  Tests: {
    Base: "/tests",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
  Roles: {
    Base: "/roles",
    Add: "/add",
  },
  Child: {
    Base: "/childs",
    Add: "/add",
    Update: "/update/:id",
    Delete: "/delete/:id",
    GetAll: "/all",
    GetById: "/get/:id",
  },
} as const;
