import { Router } from "express";

import Paths from "@src/common/constants/Paths";
import { auth } from "@src/middlewares/ middleware.authorization";
import { authRoles } from "@src/middlewares/middleware.authorizationRole";
import { transform } from "@src/middlewares/middleware.jwtTransform";
import AuthRoutes from "./AuthRoutes";
import ChildRoutes from "./ChildRoutes";
import RoleRoutes from "./RoleRoutes";
import UserRoutes from "./UserRoutes";
import HealthProfileRoutes from "./HealthProfileRoutes";
import MedicalOrderRoutes from "./MedicalOrderRoutes";

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
  [transform(), auth(), authRoles(["admin"])],
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
authRouter.post(
  Paths.Auth.VerifyToken,
  [transform(), auth()],
  AuthRoutes.verifyToken);

/******************************************************************************
                                Role routes
******************************************************************************/
const roleRouter = Router();
roleRouter.post(Paths.Roles.Add, RoleRoutes.add);
roleRouter.get(Paths.Default, RoleRoutes.getAll);

/******************************************************************************
                                Role routes
******************************************************************************/
const childRouter = Router();
childRouter.post(
  Paths.Child.Add,
  [transform(), auth(), authRoles(["parent"])],
  ChildRoutes.add
);
childRouter.get(
  Paths.Child.GetAll,
  [transform(), auth(), authRoles(["parent", "nurse"])],
  ChildRoutes.get
);
/******************************************************************************
                                Health Profile routes
******************************************************************************/
const healthProfileRouter = Router();
healthProfileRouter.post(
  Paths.HealthProfile.Add,
  [transform(), auth(), authRoles(["nurse"])],
  HealthProfileRoutes.add
);
healthProfileRouter.get(
  Paths.HealthProfile.GetByChildId,
  [transform(), auth(), authRoles(["nurse", "parent"])],
  HealthProfileRoutes.getByChildId
);
healthProfileRouter.get(
  Paths.HealthProfile.GetByID,
  [transform(), auth(), authRoles(["nurse"])],
  HealthProfileRoutes.getById
);
healthProfileRouter.put(
  Paths.HealthProfile.UpdateById,
  [transform(), auth(), authRoles(["nurse"])],
  HealthProfileRoutes.updateById
);

/******************************************************************************
                                Medical order routes
******************************************************************************/
const medicalOrderRouter = Router();
medicalOrderRouter.post(
  Paths.MedicalOrder.Add,
  [transform(), auth(), authRoles(["parent"])],
  MedicalOrderRoutes.add
);
medicalOrderRouter.get(
  Paths.Default,
  [transform(), auth(), authRoles(["parent", "nurse"])],
  MedicalOrderRoutes.get
);
medicalOrderRouter.put(
  Paths.MedicalOrder.UpdateStatus,
  [transform(), auth(), authRoles(["nurse"])],
  MedicalOrderRoutes.updateStatus
);
medicalOrderRouter.get(
  Paths.MedicalOrder.GetById,
  [transform(), auth(), authRoles(["nurse", "parent"])],
  MedicalOrderRoutes.getById
);
medicalOrderRouter.post(
  Paths.MedicalOrder.AddRecord,
  [transform(), auth(), authRoles(["nurse"])],
  MedicalOrderRoutes.addRecord
);
medicalOrderRouter.get(
  Paths.MedicalOrder.GetRecords,
  [transform(), auth(), authRoles(["nurse", "parent"])],
  MedicalOrderRoutes.getRecords
);
medicalOrderRouter.put(
  Paths.MedicalOrder.AdditionalDetails,
  [transform(), auth(), authRoles(["nurse"])],
  MedicalOrderRoutes.additionalMedicalDetails
);

/******************************************************************************
                                Index routes
******************************************************************************/
// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);
// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);
// Add RoleRouter
apiRouter.use(Paths.Roles.Base, roleRouter);
// Add ChildRouter
apiRouter.use(Paths.Child.Base, childRouter);
//Add HealthProfileRouter
apiRouter.use(Paths.HealthProfile.Base, healthProfileRouter);
// Add MedicalOrderRouter
apiRouter.use(Paths.MedicalOrder.Base, medicalOrderRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;

// appRouter.get(Paths, [transform(), auth()], funtion);
