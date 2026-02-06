import { Router } from "express";
import {
  loginController,
  signUpController,
  verifyController,
  logOutController,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/login").post(loginController);
router.route("/signup").post(signUpController);
router.route("/verify").post(verifyController);
router.route("/logout").get(logOutController);

export default router;
