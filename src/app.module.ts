import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/users.model";
import { UsersModule } from "./users/users.module";
import { AccountsModule } from "./accounts/accounts.module";
import { Account } from "src/accounts/accounts.model";
import { CategoriesModule } from "./categories/categories.module";
import { SubCategoriesModule } from "./sub-categories/sub-categories.module";
import { Category } from "src/categories/categories.model";
import { SubCategory } from "src/sub-categories/sub-categories.model";
import { TransactionsModule } from "./transactions/transactions.module";
// import { Sequelize } from "sequelize-typescript";

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "sqlite",
      storage: "database/database.sqlite",
      autoLoadModels: true,
      synchronize: true,
      models: [User, Account, Category, SubCategory],
    }),
    UsersModule,
    AccountsModule,
    CategoriesModule,
    SubCategoriesModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor() {
  //   this.syncDatabase();
  // }
  // sequelize = new Sequelize({
  //   dialect: "sqlite", // Specify your database dialect (e.g., sqlite, mysql, postgres)
  //   storage: "database/database.sqlite", // Path to your SQLite database file
  //   models: [User, Account, Category, SubCategory],
  // });
  // // Sync models with the database
  // async syncDatabase() {
  //   try {
  //     await this.sequelize.sync({ alter: true });
  //     console.log("Database synchronized successfully.");
  //   } catch (error) {
  //     console.error("Error syncing database:", error);
  //   }
  // }
}
