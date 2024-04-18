import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Transaction } from "src/transactions/transactions.model";
import { Account } from "src/accounts/accounts.model";

@Module({
  imports: [SequelizeModule.forFeature([Transaction, Account])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
