import { Types } from "mongoose";
import { IExpense, SplitType } from "../models/expense/IExpense";
import {
  ITransaction,
  TransactionStatus,
} from "../models/transaction/ITransaction";
import Expense from "../models/expense/expense";
import Transaction from "../models/transaction/transaction";
import { IGroup, ISimplifiedBalance } from "../models/group/IGroup";

interface BalanceNode {
  userId: Types.ObjectId;
  balance: number;
  outgoingEdges: Map<string, number>;
}

export class BalanceCalculationService {
  private balanceNetwork: Map<string, BalanceNode> = new Map();
  private groupId: Types.ObjectId;
  constructor(private group: IGroup) {
    this.groupId = group._id;
  }

  async calculateGroupBalance(
    simplifyBalance: boolean
  ): Promise<ISimplifiedBalance[]> {
    await this.buildBalanceNetwork();

    if (simplifyBalance) {
      this.simplifyBalances();
    } else {
      this.createUnsimplifiedBalances();
    }

    return this.getSimplifiedBalances();
  }

  private async buildBalanceNetwork(): Promise<void> {
    const expenses = await this.getGroupExpenses();
    const transactions = await this.getGroupTransactions();

    this.initializeNetwork();
    this.processExpenses(expenses);
    this.processTransactions(transactions);
  }

  private initializeNetwork(): void {
    const members = new Set<string>();
    this.group.members.forEach((member) => {
      members.add(member.toString());
    });

    members.forEach((member) => {
      this.balanceNetwork.set(member, {
        userId: new Types.ObjectId(member),
        balance: 0,
        outgoingEdges: new Map(),
      });
    });
  }

  private processExpenses(expenses: IExpense[]): void {
    expenses.forEach((expense) => {
      expense.payers.forEach((payer) => {
        this.updateBalance(payer.userId, payer.amount);
      });

      expense.splits.forEach((split) => {
        if (expense.splitType === SplitType.PERCENTAGE) {
          split.amount = (expense.amount * split.amount) / 100;
        }
        this.updateBalance(split.userId, -split.amount);
      });
    });
  }

  private processTransactions(transactions: ITransaction[]): void {
    transactions.forEach((transaction) => {
      if (transaction.status !== TransactionStatus.REJECTED) {
        this.updateBalance(transaction.from, -transaction.amount);
        this.updateBalance(transaction.to, transaction.amount);
      }
    });
  }

  private updateBalance(userId: Types.ObjectId, amount: number): void {
    const node = this.balanceNetwork.get(userId.toString());
    if (node) {
      node.balance += amount;
    }
  }

  private simplifyBalances(): void {
    const nodes = Array.from(this.balanceNetwork.values());

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const debt = Math.min(nodes[i].balance, -nodes[j].balance);
        if (debt > 0) {
          this.addEdge(nodes[i].userId, nodes[j].userId, debt);
          nodes[i].balance -= debt;
          nodes[j].balance += debt;
        }
      }
    }
  }

  private createUnsimplifiedBalances(): void {
    const nodes = Array.from(this.balanceNetwork.values());
    const positiveBalances = nodes.filter((node) => node.balance > 0);
    const negativeBalances = nodes.filter((node) => node.balance < 0);

    positiveBalances.forEach((pNode) => {
      let remainingBalance = pNode.balance;
      negativeBalances.forEach((nNode) => {
        if (remainingBalance > 0 && nNode.balance < 0) {
          const amount = Math.min(remainingBalance, -nNode.balance);
          this.addEdge(nNode.userId, pNode.userId, amount);
          remainingBalance -= amount;
          nNode.balance += amount;
        }
      });
    });
  }

  private addEdge(
    from: Types.ObjectId,
    to: Types.ObjectId,
    amount: number
  ): void {
    const fromNode = this.balanceNetwork.get(from.toString());
    if (fromNode) {
      fromNode.outgoingEdges.set(
        to.toString(),
        (fromNode.outgoingEdges.get(to.toString()) || 0) + amount
      );
    }
  }

  private getSimplifiedBalances(): ISimplifiedBalance[] {
    const simplifiedBalances: ISimplifiedBalance[] = [];
    this.balanceNetwork.forEach((node, fromId) => {
      node.outgoingEdges.forEach((amount, toId) => {
        simplifiedBalances.push({
          from: new Types.ObjectId(fromId),
          to: new Types.ObjectId(toId),
          amount,
        });
      });
    });
    return simplifiedBalances;
  }

  private async getGroupExpenses(): Promise<IExpense[]> {
    try {
      const expenses = await Expense.find({ groupId: this.groupId });
      return expenses;
    } catch (error) {
      throw new Error("Failed to fetch group expenses from the database");
    }
  }

  private async getGroupTransactions(): Promise<ITransaction[]> {
    try {
      const transactions = await Transaction.find({ groupId: this.groupId });
      return transactions;
    } catch (error) {
      throw new Error("Failed to fetch group transactions from the database");
    }
  }
}
