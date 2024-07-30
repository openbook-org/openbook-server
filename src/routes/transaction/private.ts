// private routes for transaction
import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  updateTransaction,
} from "../../controllers/transaction";

const router = Router();

router.post("/", createTransaction);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
