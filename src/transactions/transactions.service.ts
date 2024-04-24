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
    return this.transactionModel.findAll({
      where: { user_id: id },
      include: ["category", "account", "sub_category"],
    });
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
      order: [["transaction_at", "DESC"]],
    });

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
