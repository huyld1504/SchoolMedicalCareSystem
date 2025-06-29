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
import MedicalEventRoutes from "./MedicalEventRoutes";
import MedicalOrderRoutes from "./MedicalOrderRoutes";
import VaccinationRoutes from "./VaccinationRoutes";

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
  [transform(), auth(), authRoles(["nurse", "parent"])],
  HealthProfileRoutes.getById
);
healthProfileRouter.put(
  Paths.HealthProfile.UpdateById,
  [transform(), auth(), authRoles(["nurse"])],
  HealthProfileRoutes.updateById
);

/******************************************************************************
                                Medical Event routes
******************************************************************************/
const medicalEventRouter = Router();
medicalEventRouter.post(
  Paths.MedicalEvent.Create,
  [transform(), auth(), authRoles(["nurse"])],
  MedicalEventRoutes.create
);
medicalEventRouter.get(
  Paths.MedicalEvent.GetAll,
  [transform(), auth(), authRoles(["nurse", "admin"])],
  MedicalEventRoutes.getAll
);
medicalEventRouter.get(
  Paths.MedicalEvent.GetByStudentId,
  [transform(), auth(), authRoles(["nurse", "parent", "admin"])],
  MedicalEventRoutes.getByStudentId
);
medicalEventRouter.get(
  Paths.MedicalEvent.GetById,
  [transform(), auth(), authRoles(["nurse", "admin"])],
  MedicalEventRoutes.getById
);
medicalEventRouter.put(
  Paths.MedicalEvent.Update,
  [transform(), auth(), authRoles(["nurse"])],
  MedicalEventRoutes.updateById
);
medicalEventRouter.delete(
  Paths.MedicalEvent.Delete,
  [transform(), auth(), authRoles(["nurse"])],
  MedicalEventRoutes.deleteById
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
  [transform(), auth(), authRoles(["parent", "nurse", "admin"])],
  MedicalOrderRoutes.get
);
medicalOrderRouter.put(
  Paths.MedicalOrder.UpdateStatus,
  [transform(), auth(), authRoles(["nurse"])],
  MedicalOrderRoutes.updateStatus
);
medicalOrderRouter.get(
  Paths.MedicalOrder.GetById,
  [transform(), auth(), authRoles(["nurse", "parent","admin"])],
  MedicalOrderRoutes.getById
);
medicalOrderRouter.post(
  Paths.MedicalOrder.AddRecord,
  [transform(), auth(), authRoles(["nurse"])],
  MedicalOrderRoutes.addRecord
);
medicalOrderRouter.get(
  Paths.MedicalOrder.GetRecords,
  [transform(), auth(), authRoles(["nurse", "parent", "admin"])],
  MedicalOrderRoutes.getRecords
);
medicalOrderRouter.put(
  Paths.MedicalOrder.AdditionalDetails,
  [transform(), auth(), authRoles(["nurse"])],
  MedicalOrderRoutes.additionalMedicalDetails
);

/******************************************************************************
                                Vaccination routes
******************************************************************************/
const vaccinationCampaignRouter = Router();
const vaccinationParticipationRouter = Router();

// Vaccination Campaign routes (Admin functions)
vaccinationCampaignRouter.post(
  Paths.VaccinationCampaign.Create,
  [transform(), auth(), authRoles(["admin"])],
  VaccinationRoutes.createCampaign
);
vaccinationCampaignRouter.put(
  Paths.VaccinationCampaign.Update,
  [transform(), auth(), authRoles(["admin"])],
  VaccinationRoutes.updateCampaign
);
vaccinationCampaignRouter.get(
  Paths.VaccinationCampaign.GetAll,
  [transform(), auth(), authRoles(["admin", "nurse"])],
  VaccinationRoutes.getAllCampaigns
);
vaccinationCampaignRouter.get(
  Paths.VaccinationCampaign.GetById,
  [transform(), auth(), authRoles(["admin", "nurse"])],
  VaccinationRoutes.getCampaignById
);
vaccinationCampaignRouter.post(
  Paths.VaccinationCampaign.AddStudents,
  [transform(), auth(), authRoles(["admin"])],
  VaccinationRoutes.addStudentsToCampaign
);
vaccinationCampaignRouter.get(
  Paths.VaccinationCampaign.GetParticipations,
  [transform(), auth(), authRoles(["admin", "nurse"])],
  VaccinationRoutes.getCampaignParticipations
);
vaccinationCampaignRouter.get(
  Paths.VaccinationCampaign.Search,
  [transform(), auth(), authRoles(["admin", "nurse"])],
  VaccinationRoutes.searchCampaigns
);

// Vaccination Participation routes
vaccinationParticipationRouter.put(
  Paths.VaccinationParticipation.ParentConsent,
  [transform(), auth(), authRoles(["parent"])],
  VaccinationRoutes.parentConsent
);
vaccinationParticipationRouter.put(
  Paths.VaccinationParticipation.RecordVaccination,
  [transform(), auth(), authRoles(["nurse"])],
  VaccinationRoutes.recordVaccination
);
vaccinationParticipationRouter.get(
  Paths.VaccinationParticipation.Search,
  [transform(), auth(), authRoles(["admin", "nurse"])],
  VaccinationRoutes.searchParticipations
);
vaccinationParticipationRouter.get(
  Paths.VaccinationParticipation.SearchParent,
  [transform(), auth(), authRoles(["parent"])],
  VaccinationRoutes.searchParentParticipations
);

// Add routers to API
apiRouter.use(Paths.VaccinationCampaign.Base, vaccinationCampaignRouter);
apiRouter.use(Paths.VaccinationParticipation.Base, vaccinationParticipationRouter);

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
// Add MedicalEventRouter
apiRouter.use(Paths.MedicalEvent.Base, medicalEventRouter);
// Add MedicalOrderRouter
apiRouter.use(Paths.MedicalOrder.Base, medicalOrderRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;

// appRouter.get(Paths, [transform(), auth()], funtion);
