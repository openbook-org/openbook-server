import { IExpense, SplitType } from "../models/expense/IExpense";
import { ITransaction } from "../models/transaction/ITransaction";

const validatePayers = (expense: IExpense) => {
  const { payers, amount } = expense;

  if (!payers || payers.length === 0) {
    throw new Error("At least one payer is required.");
  }

  const totalPayerAmount = payers.reduce((acc, payer) => acc + payer.amount, 0);
  if (Math.abs(totalPayerAmount - amount) > 0.01) {
    // Allow for small floating point discrepancies
    throw new Error("Payers amount must be equal to total amount.");
  }
};

const validateParticipants = (expense: IExpense) => {
  const { participants, payers } = expense;

  if (!participants || participants.length === 0) {
    throw new Error("At least one participant is required.");
  }

  // Check if all payers are also participants
  const participantIds = new Set(participants.map((p) => p.toString()));
  const allPayersAreParticipants = payers.every((payer) =>
    participantIds.has(payer.userId.toString())
  );
  if (!allPayersAreParticipants) {
    throw new Error("All payers must also be participants.");
  }
};

const validateEqualSplit = (expense: IExpense) => {
  const { amount, participants, splits } = expense;
  const equalShare = amount / participants.length;

  if (splits.some((split) => Math.abs(split.amount - equalShare) > 0.01)) {
    throw new Error("For EQUAL split type, all splits must be equal.");
  }
};

const validatePercentageSplit = (expense: IExpense) => {
  const { splits } = expense;
  const totalPercentage = splits.reduce((acc, split) => acc + split.amount, 0);

  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error(
      "For PERCENTAGE split type, percentages must sum up to 100."
    );
  }
};

const validateSplits = (expense: IExpense) => {
  const { amount, participants, splits, splitType } = expense;

  if (!splits || splits.length === 0) {
    throw new Error("Splits are required.");
  }

  if (participants.length !== splits.length) {
    throw new Error("Splits are required for all participants.");
  }

  const totalSplitAmount = splits.reduce((acc, split) => acc + split.amount, 0);
  if (
    splitType !== SplitType.PERCENTAGE &&
    Math.abs(totalSplitAmount - amount) > 0.01
  ) {
    throw new Error("Splits amount must be equal to total amount.");
  }

  // Validate that all participants have a corresponding split
  const splitUserIds = new Set(splits.map((split) => split.userId.toString()));
  const allParticipantsHaveSplit = participants.every((participant) =>
    splitUserIds.has(participant.toString())
  );
  if (!allParticipantsHaveSplit) {
    throw new Error("All participants must have a corresponding split.");
  }

  switch (splitType) {
    case SplitType.EQUAL:
      validateEqualSplit(expense);
      break;
    case SplitType.PERCENTAGE:
      validatePercentageSplit(expense);
      break;
    // UNEQUAL doesn't need additional validation as we've already checked the total
  }
};

export const validateExpenseSplit = (expense: IExpense) => {
  const { amount, splitType } = expense;

  if (amount <= 0) {
    throw new Error("Total amount must be greater than zero.");
  }

  if (!splitType || !Object.values(SplitType).includes(splitType)) {
    throw new Error("Split type is required and must be valid.");
  }

  validatePayers(expense);
  validateParticipants(expense);
  validateSplits(expense);
};

export const validateTransaction = (transaction: ITransaction) => {
  const { amount, to, from } = transaction;

  if (amount <= 0) {
    throw new Error("Total amount must be greater than zero.");
  }

  if (!to || !from) {
    throw new Error("Both from and to fields are required.");
  }

  if (to === from) {
    throw new Error("From and to fields must be different.");
  }
};
