import { NextFunction, Request, Response } from "express";
import Group from "../../models/group/group";
import { ApiErrorClass, ErrorTypes } from "../../shared/apiErrorClass";
import { HttpStatusCode } from "../../shared/constant/httpStatusCodes";
import { BalanceCalculationService } from "../../services/balanceCalculator";

//! FIX: The Balanace always gets calculated on the query, Think of optimizing this by calculating the balance only when a transaction/expense is made
export const getGroupBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return new ApiErrorClass(
        ErrorTypes.RESOURCE_NOT_FOUND,
        "Group not found",
        HttpStatusCode.NOT_FOUND
      );
    }
    const balanceService = new BalanceCalculationService(group);

    //! FIX: The balance is always simplified, fix for unsimplified balance
    const groupBalance = await balanceService.calculateGroupBalance(
      Boolean(group.simpilifyBalance)
    );

    group.balances = groupBalance;

    await group.save();

    res.status(200).json({
      success: true,
      content: group.balances,
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
