import { Router } from "express";

const router = Router();

import { createSession } from "./createSession";
import { sendMessage } from "./sendMessage";

router.get("/createSession", createSession);
router.post("/sendMessage", sendMessage);

export default router;
