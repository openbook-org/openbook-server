import { NextFunction, Request, Response } from "express";
import Transaction from "../../models/transaction/transaction";
import { ApiErrorClass, ErrorTypes } from "../../shared/apiErrorClass";
import { HttpStatusCode } from "../../shared/constant/httpStatusCodes";
import { validateTransaction } from "../../services/expenseValidationService";
import { TransactionStatus } from "../../models/transaction/ITransaction";
import Group from "../../models/group/group";

interface CreateTransactionBody {
  from: string;
  to: string;
  amount: number;
  description?: string;
  groupId?: string;
  status: TransactionStatus;
}

export interface CreateTransactionRequest extends Request {
  body: CreateTransactionBody;
}

// Create a new transaction
export const createTransaction = async (
  req: CreateTransactionRequest,
  res: Response,
  next: NextFunction
) => {
  const { from, to, description, amount, groupId, status } = req.body;
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

    const transaction = new Transaction({
      from,
      to,
      description,
      amount,
      groupId,
      status,
      createdBy: req.authenticatedUser._id,
    });

    validateTransaction(transaction);

    await transaction.save();
    res.status(201).json({
      success: true,
      content: transaction,
    });
  } catch (error) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        "Service error",
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};

// Get a transaction by ID
export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return next(
        new ApiErrorClass(
          ErrorTypes.RESOURCE_NOT_FOUND,
          "Transaction not found",
          HttpStatusCode.NOT_FOUND
        )
      );
    }
    res.status(200).json({
      success: true,
      content: transaction,
    });
  } catch (error) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        "Service error",
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};

// Update a transaction by ID
export const updateTransaction = async (
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

    validateTransaction(req.body);

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!transaction) {
      return next(
        new ApiErrorClass(
          ErrorTypes.RESOURCE_NOT_FOUND,
          "Transaction not found",
          HttpStatusCode.NOT_FOUND
        )
      );
    }
    res.status(200).json({
      success: true,
      content: transaction,
    });
  } catch (error) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        "Service error",
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};

// Delete a transaction by ID
export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return next(
        new ApiErrorClass(
          ErrorTypes.RESOURCE_NOT_FOUND,
          "Transaction not found",
          HttpStatusCode.NOT_FOUND
        )
      );
    }
    res.status(200).json({
      success: true,
      content: transaction,
    });
  } catch (error) {
    return next(
      new ApiErrorClass(
        ErrorTypes.SERVICE_ERROR,
        "Service error",
        HttpStatusCode.SERVICE_ERROR
      )
    );
  }
};
