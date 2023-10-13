import { Router } from "express";

import { authController } from "../controllers";
import {
  authenticateMiddleware,
  authMiddleware,
  commonMiddleware,
} from "../middlewares";
import { userSchema } from "../validations";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(userSchema.create),
  authMiddleware.isEmailExist,
  authController.register,
);

router.get(
  "/activated/:actionToken",
  authMiddleware.isActivated,
  authMiddleware.activatedUser,
  authController.activatedUser,
);

router.post(
  "/login",
  commonMiddleware.isBodyValid(userSchema.login),
  authMiddleware.isUser,
  authMiddleware.loginError,
  authenticateMiddleware.isUserVerify,
  authController.login,
);

router.delete("/logout", authenticateMiddleware.isLogin, authController.logout);
export const authRouter = router;

// try {
//      next();
// } catch (e) {
//     next(e)
// }

// try {
//
// } catch (e){
//     throw new ApiError(e.message, e.status)
// }
