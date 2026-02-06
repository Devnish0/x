import { Router } from "express";
import {
  userProfile,
  editUserProfile,
} from "../controllers/user.controller.js";
const router = Router();

router.route("/profile").get(userProfile);
router.route("/edit").get(userProfile).post(editUserProfile);

export default router;
