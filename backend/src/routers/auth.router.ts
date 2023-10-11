import { Router } from "express";

import { authController } from "../controllers";
import { authMiddleware, commonMiddleware } from "../middlewares";
import { userSchema } from "../validations";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(userSchema.create),
  authMiddleware.isEmailExist,
  authController.register,
);
export const authRouter = router;

// try {
//
// } catch (e) {
//     next(e)
// }

// try {
//
// } catch (e){
//     throw new ApiError(e.message, e.status)
// }
