import { NextFunction, Request, Response } from "express";
import Expense from "../../models/expense/expense";
import { ApiErrorClass, ErrorTypes } from "../../shared/apiErrorClass";
import { HttpStatusCode } from "../../shared/constant/httpStatusCodes";
import { validateExpenseSplit } from "../../services/expenseValidationService";
import Group from "../../models/group/group";

interface CreateExpenseBody {
  title: string;
  description?: string;
  amount: number;
  payers: {
    userId: string;
    amount: number;
  }[];
  participants: string[];
  groupId?: string;
  splitType: string;
  splits: {
    userId: string;
    amount: number;
  }[];
}

export interface CreateExpenseRequest extends Request {
  body: CreateExpenseBody;
}

// Create a new expense
export const createExpense = async (
  req: CreateExpenseRequest,
  res: Response,
  next: NextFunction
) => {
  const {
    title,
    description,
    amount,
    payers,
    participants,
    groupId,
    splitType,
    splits,
  } = req.body;
  try {
    // validate group ID
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return next(
          new ApiErrorClass(
            ErrorTypes.RESOURCE_NOT_FOUND,
            "Group not found",
            HttpStatusCode.NOT_FOUND
          )
        );
      }
    }

    const expense = new Expense({
      title,
      description,
      amount,
      payers,
      participants,
      groupId,
      splitType,
      splits,
      createdBy: req.authenticatedUser._id,
    });

    validateExpenseSplit(expense);

    await expense.save();
    res.status(201).json({
      success: true,
      content: expense,
    });
  } catch (error: any) {
    return new ApiErrorClass(
      ErrorTypes.SERVICE_ERROR,
      error.message,
      HttpStatusCode.SERVICE_ERROR
    );
  }
};

// Get an expense by ID
export const getExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return next(
        new ApiErrorClass(
          ErrorTypes.RESOURCE_NOT_FOUND,
          "Expense not found",
          HttpStatusCode.NOT_FOUND
        )
      );
    }
    res.status(200).json({
      success: true,
      content: expense,
    });
  } catch (error: any) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        error.message,
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};

// Update an expense by ID
export const updateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate group ID
    if (req.body.groupId) {
      const group = await Group.findById(req.body.groupId);
      if (!group) {
        return next(
          new ApiErrorClass(
            ErrorTypes.RESOURCE_NOT_FOUND,
            "Group not found",
            HttpStatusCode.NOT_FOUND
          )
        );
      }
    }
    validateExpenseSplit(req.body);

    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expense) {
      return next(
        new ApiErrorClass(
          ErrorTypes.RESOURCE_NOT_FOUND,
          "Expense not found",
          HttpStatusCode.NOT_FOUND
        )
      );
    }
    res.status(200).json({
      success: true,
      content: expense,
    });
  } catch (error: any) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        error.message,
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};

// Delete an expense by ID
export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return next(
        new ApiErrorClass(
          ErrorTypes.RESOURCE_NOT_FOUND,
          "Expense not found",
          HttpStatusCode.NOT_FOUND
        )
      );
    }
    res.status(200).json({
      success: true,
      content: expense,
    });
  } catch (error: any) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        error.message,
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};
