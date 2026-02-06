import { Router } from "express";
import { feedController } from "../controllers/feed.controller.js";
const router = Router();

router.route("/index").get(feedController);

export default router;
