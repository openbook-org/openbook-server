// private routes for user
import { Router } from "express";

import {
  deleteUser,
  getAuthenticatedUser,
  updateUser,
} from "../../controllers/user/index";

const router = Router();

router.get("/self", getAuthenticatedUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;
