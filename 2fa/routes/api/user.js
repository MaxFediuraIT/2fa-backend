import { Router } from "express";
import { UserController } from "../../controller/index.js";
import { validation } from "../../midlware/index.js";
import {
  joiLoginUserSchema,
  joiRegisterUserSchema,
} from "../../model/index.js";
const userRouter = Router();
userRouter.post(
  "/register",
  validation(joiRegisterUserSchema),
  UserController.register
);
userRouter.post("/login", validation(joiLoginUserSchema), UserController.login);

userRouter.post("/logout", UserController.logout);

userRouter.get("/generate-otp", UserController.generateOTP);

userRouter.post("/verify-otp", UserController.verifyOTP);

// userRouter.get('/generate-secret', UserController.generateSecret);

export { userRouter };
