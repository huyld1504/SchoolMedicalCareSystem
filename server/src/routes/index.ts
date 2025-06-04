import { Router } from "express";

import Paths from "@src/common/constants/Paths";
import UserRoutes from "./UserRoutes";
import AuthRoutes from "./AuthRoutes";
import { auth } from "@src/middlewares/ middleware.authorization";
import { transform } from "@src/middlewares/middleware.jwtTransform";
import RoleRoutes from "./RoleRoutes";
import { authAdmin } from "@src/middlewares/middleware.authorizationAdmin";

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ** Add UserRouter ** //

// Init router
const userRouter = Router();

/******************************************************************************
                                User routes
******************************************************************************/
// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(
  Paths.Users.Add,
  [transform(), auth(), authAdmin()],
  UserRoutes.add
);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);
userRouter.get(Paths.Users.Pagination, UserRoutes.getUsersWithPagination);
userRouter.get(Paths.Users.Search, UserRoutes.searchUsers);

const authRouter = Router();
/******************************************************************************
                                Auth routes
******************************************************************************/
// Add AuthRouter
authRouter.post(Paths.Auth.Login, AuthRoutes.login);
authRouter.post(Paths.Auth.Register, AuthRoutes.register);

/******************************************************************************
                                Role routes
******************************************************************************/
const roleRouter = Router();
roleRouter.post(Paths.Roles.Add, RoleRoutes.add);
roleRouter.get(Paths.Default, RoleRoutes.getAll);

/******************************************************************************
                                Index routes
******************************************************************************/
// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);
// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);
// Add RoleRouter
apiRouter.use(Paths.Roles.Base, roleRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;

// appRouter.get(Paths, [transform(), auth()], funtion);
