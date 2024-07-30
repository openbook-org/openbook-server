// private routes for group
import { Router } from "express";
import {
  createGroup,
  deleteGroup,
  getGroupById,
  updateGroup,
} from "../../controllers/group";
import { getGroupBalance } from "../../controllers/group/balanceController";

const router = Router();

router.post("/", createGroup);
router.get("/:id", getGroupById);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

// router.get("/:id/ledger", );

router.get("/:id/balance", getGroupBalance);

export default router;
