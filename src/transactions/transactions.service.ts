import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Account } from "src/accounts/accounts.model";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from "src/transactions/transactions.dto";
import { Transaction } from "src/transactions/transactions.model";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction) private transactionModel: typeof Transaction,
    @InjectModel(Account) private accountModel: typeof Account,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const {
      user_id,
      account_id,
      category_id,
      sub_category_id,
      type,
      amount,
      notes,
      transaction_at,
    } = createTransactionDto;
    const transaction = await this.transactionModel.create({
      user_id,
      account_id,
      category_id,
      sub_category_id,
      type,
      amount,
      notes,
      transaction_at,
    });

    const account = await this.accountModel.findOne({
      where: { id: account_id },
    });

    if (type === "income") {
      account.amount += amount;
    } else if (type === "expense") {
      account.amount -= amount;
    }

    await account.save();

    return transaction;
  }

  findAll() {
    return this.transactionModel.findAll();
  }

  findByUserId(id: number) {
    return this.transactionModel.findAll({ where: { user_id: id } });
  }

  findByAccountId(id: number) {
    return this.transactionModel.findAll({ where: { account_id: id } });
  }

  findByCategoryId(id: number) {
    return this.transactionModel.findAll({ where: { category_id: id } });
  }

  findBySubCategoryId(id: number) {
    return this.transactionModel.findAll({ where: { sub_category_id: id } });
  }

  async getDailyTransactionByMonth(
    userId: number,
    month: number,
    year: number,
  ) {
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year}-${month + 1}-01`);

    const transactions = await this.transactionModel.findAll({
      where: {
        user_id: userId,
        transaction_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: ["category", "account", "sub_category"],
      order: [["transaction_at", "ASC"]],
    });

    // const dailyTransactionsMap = new Map<string, DailyTransaction>();
    // transactions.forEach((transaction) => {
    //   const transactionAt = new Date(transaction.transaction_at).toISOString();
    //   let dailyTransaction = dailyTransactionsMap.get(transactionAt);

    //   if (!dailyTransaction) {
    //     dailyTransaction = {
    //       transaction_at: transactionAt,
    //       total_income: 0,
    //       total_expense: 0,
    //       transactions: [],
    //     };
    //   }

    //   if (transaction.type === "income") {
    //     dailyTransaction.total_income += transaction.amount;
    //   } else if (transaction.type === "expense") {
    //     dailyTransaction.total_expense += transaction.amount;
    //   }

    //   dailyTransaction.transactions.push(transaction);
    //   dailyTransactionsMap.set(transactionAt, dailyTransaction);
    // });

    // return Array.from(dailyTransactionsMap.values());
    return transactions;
  }

  findOne(id: number) {
    return this.transactionModel.findOne({ where: { id } });
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    await this.transactionModel.update(updateTransactionDto, {
      where: { id },
    });
  }

  async remove(id: number) {
    await this.transactionModel.destroy({ where: { id } });
  }
}
