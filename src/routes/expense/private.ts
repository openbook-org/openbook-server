// private routes for expense
import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  updateExpense,
} from "../../controllers/expense";

const router = Router();

router.post("/", createExpense);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
